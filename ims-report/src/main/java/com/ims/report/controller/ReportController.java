package com.ims.report.controller;

import com.ims.report.dto.*;
import com.ims.report.service.IReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 报表控制器
 */
@RestController
@RequestMapping("/api/report")
public class ReportController {
    
    @Autowired
    private IReportService reportService;
    
    /**
     * 仪表盘数据
     */
    @GetMapping("/dashboard")
    public DashboardDTO getDashboard() {
        return reportService.getDashboardData();
    }
    
    /**
     * 销售日报
     */
    @GetMapping("/sales/daily")
    public SalesReportDTO getDailySales() {
        return reportService.getDailySalesReport();
    }
    
    /**
     * 销售汇总
     */
    @GetMapping("/sales/summary")
    public List<SalesReportDTO> getSalesSummary(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return reportService.getSalesSummary(request);
    }
    
    /**
     * 采购日报
     */
    @GetMapping("/purchase/daily")
    public PurchaseReportDTO getDailyPurchase() {
        return reportService.getDailyPurchaseReport();
    }
    
    /**
     * 采购汇总
     */
    @GetMapping("/purchase/summary")
    public List<PurchaseReportDTO> getPurchaseSummary(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return reportService.getPurchaseSummary(request);
    }
    
    /**
     * 库存报表
     */
    @GetMapping("/inventory/list")
    public List<InventoryReportDTO> getInventoryList(
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) Long productId) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setWarehouseId(warehouseId);
        request.setProductId(productId);
        return reportService.getInventoryList(request);
    }
    
    /**
     * 低库存预警
     */
    @GetMapping("/inventory/low-stock")
    public List<InventoryReportDTO> getLowStockWarning() {
        return reportService.getLowStockWarning();
    }
    
    /**
     * 呆滞库存
     */
    @GetMapping("/inventory/idle-stock")
    public List<InventoryReportDTO> getIdleStock(
            @RequestParam(defaultValue = "30") Integer days) {
        return reportService.getIdleStock(days);
    }
    
    /**
     * 销售趋势
     */
    @GetMapping("/trend/sales")
    public TrendDTO getSalesTrend(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return reportService.getSalesTrend(request);
    }
    
    /**
     * 采购趋势
     */
    @GetMapping("/trend/purchase")
    public TrendDTO getPurchaseTrend(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return reportService.getPurchaseTrend(request);
    }
    
    /**
     * 财务报表
     */
    @GetMapping("/finance/summary")
    public FinanceReportDTO getFinanceSummary(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return reportService.getFinanceSummary(request);
    }
}