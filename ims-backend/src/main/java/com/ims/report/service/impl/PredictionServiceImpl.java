package com.ims.report.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ims.report.dto.InventoryAlertDTO;
import com.ims.report.dto.InventoryReportDTO;
import com.ims.report.dto.PurchaseSuggestionDTO;
import com.ims.report.dto.SalesForecastDTO;
import com.ims.report.entity.PredictionConfig;
import com.ims.report.mapper.PredictionConfigMapper;
import com.ims.report.mapper.ReportMapper;
import com.ims.report.service.PredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * AI预测Service实现
 */
@Service
public class PredictionServiceImpl implements PredictionService {

    @Autowired
    private ReportMapper reportMapper;

    @Autowired
    private PredictionConfigMapper configMapper;

    private static final double DEFAULT_ALPHA = 0.3; // 指数平滑alpha值

    @Override
    public List<SalesForecastDTO> forecastSales(Long productId, int forecastDays, int historyDays) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(historyDays);

        List<Map<String, Object>> rawData = reportMapper.getHistoricalSales(startDate, endDate);

        // 按商品分组
        Map<Long, List<Map<String, Object>>> productSalesMap = rawData.stream()
                .collect(Collectors.groupingBy(m -> ((Number) m.get("product_id")).longValue()));

        List<SalesForecastDTO> forecasts = new ArrayList<>();

        for (Map.Entry<Long, List<Map<String, Object>>> entry : productSalesMap.entrySet()) {
            Long pid = entry.getKey();
            if (productId != null && !pid.equals(productId)) continue;

            List<Map<String, Object>> salesData = entry.getValue();
            if (salesData.isEmpty()) continue;

            String productName = (String) salesData.get(0).get("product_name");
            String productCode = (String) salesData.get(0).get("product_code");

            // 构建日销量时间序列
            Map<LocalDate, BigDecimal> dailySales = new TreeMap<>();
            for (Map<String, Object> row : salesData) {
                LocalDate date = ((java.sql.Date) row.get("sale_date")).toLocalDate();
                BigDecimal qty = new BigDecimal(row.get("total_quantity").toString());
                dailySales.merge(date, qty, BigDecimal::add);
            }

            // 使用指数平滑预测
            List<BigDecimal> forecastValues = exponentialSmoothing(
                    dailySales.values().stream().mapToDouble(BigDecimal::doubleValue).boxed().toList(),
                    forecastDays
            );

            // 计算标准差用于置信区间
            double stdDev = calculateStdDev(dailySales.values().stream()
                    .mapToDouble(BigDecimal::doubleValue).toArray());

            // 生成预测结果
            LocalDate currentDate = endDate.plusDays(1);
            for (int i = 0; i < forecastDays; i++) {
                SalesForecastDTO dto = new SalesForecastDTO();
                dto.setProductId(pid);
                dto.setProductName(productName);
                dto.setProductCode(productCode);
                dto.setDate(currentDate.plusDays(i));
                dto.setForecastQuantity(forecastValues.get(i).setScale(2, RoundingMode.HALF_UP));
                dto.setLowerBound(BigDecimal.valueOf(Math.max(0, forecastValues.get(i).doubleValue() - 1.96 * stdDev)).setScale(2, RoundingMode.HALF_UP));
                dto.setUpperBound(BigDecimal.valueOf(forecastValues.get(i).doubleValue() + 1.96 * stdDev).setScale(2, RoundingMode.HALF_UP));
                dto.setConfidence(0.95);
                forecasts.add(dto);
            }
        }

        return forecasts;
    }

    @Override
    public List<PurchaseSuggestionDTO> suggestPurchases(int forecastDays, int safetyStockDays) {
        // 先获取预测销量
        List<SalesForecastDTO> forecasts = forecastSales(null, forecastDays, 30);

        // 获取当前库存
        List<Map<String, Object>> inventoryData = reportMapper.getCurrentInventory();
        Map<Long, BigDecimal> inventoryMap = inventoryData.stream()
                .collect(Collectors.toMap(
                        m -> ((Number) m.get("product_id")).longValue(),
                        m -> new BigDecimal(m.get("current_stock").toString())
                ));

        // 按商品汇总预测销量
        Map<Long, BigDecimal> forecastSumMap = forecasts.stream()
                .collect(Collectors.groupingBy(
                        SalesForecastDTO::getProductId,
                        Collectors.reducing(BigDecimal.ZERO, SalesForecastDTO::getForecastQuantity, BigDecimal::add)
                ));

        List<PurchaseSuggestionDTO> suggestions = new ArrayList<>();

        for (Map.Entry<Long, BigDecimal> entry : forecastSumMap.entrySet()) {
            Long productId = entry.getKey();
            BigDecimal forecastTotal = entry.getValue();
            BigDecimal currentStock = inventoryMap.getOrDefault(productId, BigDecimal.ZERO);

            // 日均销量
            BigDecimal dailyAvg = forecastTotal.divide(BigDecimal.valueOf(forecastDays), 4, RoundingMode.HALF_UP);

            // 安全库存 = 日均销量 * 安全库存天数
            BigDecimal safetyStock = dailyAvg.multiply(BigDecimal.valueOf(safetyStockDays));

            // 库存天数 = 当前库存 / 日均销量
            int stockDays = dailyAvg.compareTo(BigDecimal.ZERO) > 0
                    ? currentStock.divide(dailyAvg, 0, RoundingMode.DOWN).intValue()
                    : 999;

            // 建议采购量
            BigDecimal suggestedQty = safetyStock.subtract(currentStock);
            if (suggestedQty.compareTo(BigDecimal.ZERO) < 0) suggestedQty = BigDecimal.ZERO;

            // 预计库存耗尽日期
            LocalDate stockoutDate = dailyAvg.compareTo(BigDecimal.ZERO) > 0
                    ? LocalDate.now().plusDays(stockDays)
                    : null;

            // 建议采购日期（库存耗尽前7天）
            LocalDate suggestDate = stockoutDate != null ? stockoutDate.minusDays(7) : null;

            // 紧急程度
            String urgency;
            if (stockDays <= 7) urgency = "HIGH";
            else if (stockDays <= 14) urgency = "MEDIUM";
            else urgency = "LOW";

            // 查找商品名称
            String productName = forecasts.stream()
                    .filter(f -> f.getProductId().equals(productId))
                    .findFirst()
                    .map(SalesForecastDTO::getProductName)
                    .orElse("未知");
            String productCode = forecasts.stream()
                    .filter(f -> f.getProductId().equals(productId))
                    .findFirst()
                    .map(SalesForecastDTO::getProductCode)
                    .orElse("未知");

            PurchaseSuggestionDTO dto = new PurchaseSuggestionDTO();
            dto.setProductId(productId);
            dto.setProductName(productName);
            dto.setProductCode(productCode);
            dto.setCurrentStock(currentStock);
            dto.setSuggestedQuantity(suggestedQty.setScale(0, RoundingMode.CEILING));
            dto.setEstimatedStockoutDate(stockoutDate);
            dto.setSuggestedPurchaseDate(suggestDate);
            dto.setUrgency(urgency);
            dto.setRemark(String.format("日均销量约%.1f，安全库存%d天", dailyAvg, safetyStockDays));
            suggestions.add(dto);
        }

        // 按紧急程度排序
        suggestions.sort(Comparator.comparingInt(s -> {
            switch (s.getUrgency()) {
                case "HIGH": return 0;
                case "MEDIUM": return 1;
                default: return 2;
            }
        }));

        return suggestions;
    }

    @Override
    public List<InventoryAlertDTO> alertInventory() {
        List<InventoryAlertDTO> alerts = new ArrayList<>();

        // 获取当前库存
        List<Map<String, Object>> inventoryData = reportMapper.getCurrentInventory();

        // 获取低库存预警（库存 < 安全库存）
        List<InventoryReportDTO> lowStockData = reportMapper.getLowStockList();
        for (InventoryReportDTO row : lowStockData) {
            InventoryAlertDTO dto = new InventoryAlertDTO();
            dto.setProductId(row.getProductId());
            dto.setProductName(row.getProductName());
            dto.setProductCode(row.getProductCode());
            dto.setAlertType("LOW_STOCK");
            dto.setCurrentStock(BigDecimal.valueOf(row.getQuantity() != null ? row.getQuantity() : 0));
            dto.setThreshold(BigDecimal.valueOf(row.getMinQuantity() != null ? row.getMinQuantity() : 0));
            dto.setAlertDate(LocalDate.now());
            dto.setMessage("库存低于最小库存预警线");
            alerts.add(dto);
        }

        // 获取呆滞库存（90天无变动）
        List<InventoryReportDTO> idleData = reportMapper.getIdleStockList(90);
        for (InventoryReportDTO row : idleData) {
            InventoryAlertDTO dto = new InventoryAlertDTO();
            dto.setProductId(row.getProductId());
            dto.setProductName(row.getProductName());
            dto.setProductCode(row.getProductCode());
            dto.setAlertType("STAGNANT");
            dto.setCurrentStock(BigDecimal.valueOf(row.getQuantity() != null ? row.getQuantity() : 0));
            dto.setAlertDate(LocalDate.now());
            dto.setMessage("库存呆滞超过90天");
            alerts.add(dto);
        }

        // 高库存预警（库存 > 3个月销量）
        List<SalesForecastDTO> forecasts = forecastSales(null, 90, 90);
        Map<Long, BigDecimal> forecastSumMap = forecasts.stream()
                .collect(Collectors.groupingBy(
                        SalesForecastDTO::getProductId,
                        Collectors.reducing(BigDecimal.ZERO, SalesForecastDTO::getForecastQuantity, BigDecimal::add)
                ));

        for (Map<String, Object> row : inventoryData) {
            Long productId = ((Number) row.get("product_id")).longValue();
            BigDecimal currentStock = new BigDecimal(row.get("current_stock").toString());
            BigDecimal threeMonthForecast = forecastSumMap.getOrDefault(productId, BigDecimal.ZERO);

            if (currentStock.compareTo(threeMonthForecast) > 0 && threeMonthForecast.compareTo(BigDecimal.ZERO) > 0) {
                InventoryAlertDTO dto = new InventoryAlertDTO();
                dto.setProductId(productId);
                dto.setProductName((String) row.get("product_name"));
                dto.setProductCode((String) row.get("product_code"));
                dto.setAlertType("OVERSTOCK");
                dto.setCurrentStock(currentStock);
                dto.setThreshold(threeMonthForecast);
                dto.setAlertDate(LocalDate.now());
                dto.setMessage("库存高于3个月销量，建议促销或减少采购");
                alerts.add(dto);
            }
        }

        return alerts;
    }

    @Override
    public PredictionConfig getConfig(String configType) {
        LambdaQueryWrapper<PredictionConfig> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PredictionConfig::getConfigType, configType);
        PredictionConfig config = configMapper.selectOne(wrapper);

        if (config == null) {
            config = createDefaultConfig(configType);
            configMapper.insert(config);
        }
        return config;
    }

    @Override
    public void updateConfig(PredictionConfig config) {
        if (config.getId() == null) {
            LambdaQueryWrapper<PredictionConfig> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(PredictionConfig::getConfigType, config.getConfigType());
            PredictionConfig existing = configMapper.selectOne(wrapper);
            if (existing != null) {
                config.setId(existing.getId());
                configMapper.updateById(config);
            } else {
                configMapper.insert(config);
            }
        } else {
            configMapper.updateById(config);
        }
    }

    /**
     * 简单指数平滑
     */
    private List<BigDecimal> exponentialSmoothing(List<Double> values, int forecastDays) {
        if (values.isEmpty()) {
            return Collections.nCopies(forecastDays, BigDecimal.ZERO);
        }

        double[] smoothed = new double[values.size()];
        smoothed[0] = values.get(0);

        // 计算初始平滑值
        double alpha = DEFAULT_ALPHA;
        for (int i = 1; i < values.size(); i++) {
            smoothed[i] = alpha * values.get(i) + (1 - alpha) * smoothed[i - 1];
        }

        // 最后一个平滑值作为基准预测未来值
        double lastSmoothed = smoothed[smoothed.length - 1];

        // 添加季节性调整（简化版：使用周内模式）
        double[] weeklyFactor = calculateWeeklyFactor(values);

        List<BigDecimal> forecasts = new ArrayList<>();
        for (int i = 0; i < forecastDays; i++) {
            int dayOfWeek = (values.size() + i) % 7;
            double forecast = lastSmoothed * weeklyFactor[dayOfWeek];
            forecasts.add(BigDecimal.valueOf(Math.max(0, forecast)));
        }

        return forecasts;
    }

    /**
     * 计算周内模式因子
     */
    private double[] calculateWeeklyFactor(List<Double> values) {
        double[] factor = new double[7];
        Arrays.fill(factor, 1.0);

        if (values.size() < 14) return factor;

        // 简化：假设周末销量略低
        factor[0] = 0.7; // 周日
        factor[6] = 0.8; // 周六
        factor[1] = 1.1; // 周一略高
        factor[5] = 1.1; // 周五略高

        return factor;
    }

    /**
     * 计算标准差
     */
    private double calculateStdDev(double[] values) {
        if (values.length == 0) return 0;
        double sum = 0;
        for (double v : values) sum += v;
        double mean = sum / values.length;
        double variance = 0;
        for (double v : values) variance += (v - mean) * (v - mean);
        return Math.sqrt(variance / values.length);
    }

    private PredictionConfig createDefaultConfig(String configType) {
        PredictionConfig config = new PredictionConfig();
        config.setConfigType(configType);
        config.setAlgorithm("EXPONENTIAL");
        config.setForecastDays(30);
        config.setHistoryDays(90);
        config.setSafetyStockDays(7);
        config.setStatus(1);
        return config;
    }
}
