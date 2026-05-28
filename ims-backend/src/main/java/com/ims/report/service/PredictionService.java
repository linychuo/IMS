package com.ims.report.service;

import com.ims.report.dto.InventoryAlertDTO;
import com.ims.report.dto.PurchaseSuggestionDTO;
import com.ims.report.dto.SalesForecastDTO;
import com.ims.report.entity.PredictionConfig;

import java.util.List;

/**
 * AI预测Service
 */
public interface PredictionService {

    /**
     * 销售预测
     * @param productId 商品ID（可选，不传则预测所有商品）
     * @param forecastDays 预测天数
     * @param historyDays 历史数据天数
     * @return 预测结果列表
     */
    List<SalesForecastDTO> forecastSales(Long productId, int forecastDays, int historyDays);

    /**
     * 采购建议
     * @param forecastDays 预测天数
     * @param safetyStockDays 安全库存天数
     * @return 采购建议列表
     */
    List<PurchaseSuggestionDTO> suggestPurchases(int forecastDays, int safetyStockDays);

    /**
     * 库存预警
     * @return 预警列表
     */
    List<InventoryAlertDTO> alertInventory();

    /**
     * 获取预测配置
     */
    PredictionConfig getConfig(String configType);

    /**
     * 更新预测配置
     */
    void updateConfig(PredictionConfig config);
}
