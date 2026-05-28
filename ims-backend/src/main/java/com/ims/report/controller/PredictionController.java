package com.ims.report.controller;

import com.ims.core.result.Result;
import com.ims.report.dto.InventoryAlertDTO;
import com.ims.report.dto.PurchaseSuggestionDTO;
import com.ims.report.dto.SalesForecastDTO;
import com.ims.report.entity.PredictionConfig;
import com.ims.report.service.PredictionService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AI预测Controller
 */
@RestController
@RequestMapping("/api/prediction")
@Permission(code = "report:prediction", name = "AI智能预测")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    /**
     * 销售预测
     */
    @GetMapping("/sales")
    @Permission(code = "read", name = "查看预测")
    public Result<List<SalesForecastDTO>> forecastSales(
            @RequestParam(required = false) Long productId,
            @RequestParam(defaultValue = "30") int forecastDays,
            @RequestParam(defaultValue = "90") int historyDays) {
        List<SalesForecastDTO> forecasts = predictionService.forecastSales(productId, forecastDays, historyDays);
        return Result.ok(forecasts);
    }

    /**
     * 采购建议
     */
    @GetMapping("/purchase-suggestion")
    @Permission(code = "read", name = "查看建议")
    public Result<List<PurchaseSuggestionDTO>> suggestPurchases(
            @RequestParam(defaultValue = "30") int forecastDays,
            @RequestParam(defaultValue = "7") int safetyStockDays) {
        List<PurchaseSuggestionDTO> suggestions = predictionService.suggestPurchases(forecastDays, safetyStockDays);
        return Result.ok(suggestions);
    }

    /**
     * 库存预警
     */
    @GetMapping("/inventory-alert")
    @Permission(code = "read", name = "查看预警")
    public Result<List<InventoryAlertDTO>> alertInventory() {
        List<InventoryAlertDTO> alerts = predictionService.alertInventory();
        return Result.ok(alerts);
    }

    /**
     * 获取预测配置
     */
    @GetMapping("/config/{configType}")
    @Permission(code = "read", name = "查看配置")
    public Result<PredictionConfig> getConfig(@PathVariable String configType) {
        PredictionConfig config = predictionService.getConfig(configType);
        return Result.ok(config);
    }

    /**
     * 更新预测配置
     */
    @PutMapping("/config")
    @Permission(code = "update", name = "更新配置")
    public Result<?> updateConfig(@RequestBody PredictionConfig config) {
        predictionService.updateConfig(config);
        return Result.ok();
    }
}
