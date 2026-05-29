package com.ims.report.controller;

import com.ims.core.result.Result;
import com.ims.report.dto.*;
import com.ims.report.service.IReportService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 报表控制器
 */
@RestController
@RequestMapping("/api/report")
@Permission(code = "report:dashboard", name = "报表中心")
public class ReportController {

    @Autowired
    private IReportService reportService;

    /**
     * 仪表盘数据
     */
    @GetMapping("/dashboard")
    @Permission(code = "read", name = "查看仪表盘")
    public Result<DashboardDTO> getDashboard() {
        return Result.success(reportService.getDashboardData());
    }

    /**
     * 销售日报
     */
    @GetMapping("/sales/daily")
    @Permission(code = "read", name = "查看销售报表")
    public Result<SalesReportDTO> getDailySales() {
        return Result.success(reportService.getDailySalesReport());
    }

    /**
     * 销售汇总
     */
    @GetMapping("/sales/summary")
    @Permission(code = "read", name = "查看销售报表")
    public Result<List<SalesReportDTO>> getSalesSummary(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return Result.success(reportService.getSalesSummary(request));
    }

    /**
     * 销售报表 (前端兼容)
     */
    @GetMapping("/sales")
    @Permission(code = "read", name = "查看销售报表")
    public Result<List<SalesReportDTO>> getSalesReport(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return Result.success(reportService.getSalesSummary(request));
    }

    /**
     * 库存报表 (前端兼容)
     */
    @GetMapping("/inventory")
    @Permission(code = "read", name = "查看库存报表")
    public Result<List<InventoryReportDTO>> getInventoryReport(
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) Long productId) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setWarehouseId(warehouseId);
        request.setProductId(productId);
        return Result.success(reportService.getInventoryList(request));
    }

    /**
     * 财务报表 (前端兼容)
     */
    @GetMapping("/finance")
    @Permission(code = "read", name = "查看财务报表")
    public Result<FinanceReportDTO> getFinanceReport(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return Result.success(reportService.getFinanceSummary(request));
    }

    /**
     * 采购日报
     */
    @GetMapping("/purchase/daily")
    @Permission(code = "read", name = "查看采购报表")
    public Result<PurchaseReportDTO> getDailyPurchase() {
        return Result.success(reportService.getDailyPurchaseReport());
    }

    /**
     * 采购汇总
     */
    @GetMapping("/purchase/summary")
    @Permission(code = "read", name = "查看采购报表")
    public Result<List<PurchaseReportDTO>> getPurchaseSummary(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return Result.success(reportService.getPurchaseSummary(request));
    }

    /**
     * 库存报表
     */
    @GetMapping("/inventory/list")
    @Permission(code = "read", name = "查看库存报表")
    public Result<List<InventoryReportDTO>> getInventoryList(
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) Long productId) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setWarehouseId(warehouseId);
        request.setProductId(productId);
        return Result.success(reportService.getInventoryList(request));
    }

    /**
     * 低库存预警
     */
    @GetMapping("/inventory/low-stock")
    @Permission(code = "read", name = "查看库存报表")
    public Result<List<InventoryReportDTO>> getLowStockWarning() {
        return Result.success(reportService.getLowStockWarning());
    }

    /**
     * 呆滞库存
     */
    @GetMapping("/inventory/idle-stock")
    @Permission(code = "read", name = "查看库存报表")
    public Result<List<InventoryReportDTO>> getIdleStock(
            @RequestParam(defaultValue = "30") Integer days) {
        return Result.success(reportService.getIdleStock(days));
    }

    /**
     * 销售趋势
     */
    @GetMapping("/trend/sales")
    @Permission(code = "read", name = "查看趋势分析")
    public Result<TrendDTO> getSalesTrend(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return Result.success(reportService.getSalesTrend(request));
    }

    /**
     * 采购趋势
     */
    @GetMapping("/trend/purchase")
    @Permission(code = "read", name = "查看趋势分析")
    public Result<TrendDTO> getPurchaseTrend(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return Result.success(reportService.getPurchaseTrend(request));
    }

    /**
     * 财务报表
     */
    @GetMapping("/finance/summary")
    @Permission(code = "read", name = "查看财务报表")
    public Result<FinanceReportDTO> getFinanceSummary(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        ReportQueryRequest request = new ReportQueryRequest();
        request.setStartDate(startDate);
        request.setEndDate(endDate);
        return Result.success(reportService.getFinanceSummary(request));
    }

    /**
     * 客户分析 - 汇总
     */
    @GetMapping("/analysis/customer")
    @Permission(code = "read", name = "查看分析报表")
    public Result<List<CustomerAnalysisDTO>> getCustomerAnalysis(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(reportService.getCustomerAnalysis(startDate, endDate));
    }

    /**
     * 客户分析 - 单个客户
     */
    @GetMapping("/analysis/customer/{customerId}")
    @Permission(code = "read", name = "查看分析报表")
    public Result<CustomerAnalysisDTO> getCustomerAnalysisById(@PathVariable Long customerId) {
        return Result.success(reportService.getCustomerAnalysisById(customerId));
    }

    /**
     * 商品分析
     */
    @GetMapping("/analysis/product")
    @Permission(code = "read", name = "查看分析报表")
    public Result<List<ProductAnalysisDTO>> getProductAnalysis(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(reportService.getProductAnalysis(startDate, endDate));
    }

    /**
     * 供应商分析 - 汇总
     */
    @GetMapping("/analysis/supplier")
    @Permission(code = "read", name = "查看分析报表")
    public Result<List<SupplierAnalysisDTO>> getSupplierAnalysis(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(reportService.getSupplierAnalysis(startDate, endDate));
    }

    /**
     * 供应商分析 - 单个供应商
     */
    @GetMapping("/analysis/supplier/{supplierId}")
    @Permission(code = "read", name = "查看分析报表")
    public Result<SupplierAnalysisDTO> getSupplierAnalysisById(@PathVariable Long supplierId) {
        return Result.success(reportService.getSupplierAnalysisById(supplierId));
    }

    /**
     * 库存周转分析
     */
    @GetMapping("/analysis/inventory-turnover")
    @Permission(code = "read", name = "查看分析报表")
    public Result<List<InventoryTurnoverDTO>> getInventoryTurnover(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(reportService.getInventoryTurnover(startDate, endDate));
    }

    /**
     * 毛利分析
     */
    @GetMapping("/analysis/profit-margin")
    @Permission(code = "read", name = "查看分析报表")
    public Result<List<ProfitMarginDTO>> getProfitMargin(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(reportService.getProfitMargin(startDate, endDate));
    }

    /**
     * 回款统计
     */
    @GetMapping("/collection/statistics")
    @Permission(code = "read", name = "查看回款统计")
    public Result<java.util.List<com.ims.report.dto.CollectionStatisticsDTO>> getCollectionStatistics(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(reportService.getCollectionStatistics(startDate, endDate));
    }
}