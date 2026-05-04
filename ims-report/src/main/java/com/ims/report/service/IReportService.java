package com.ims.report.service;

import com.ims.report.dto.*;

/**
 * 报表服务接口
 */
public interface IReportService {
    
    /**
     * 获取仪表盘数据
     */
    DashboardDTO getDashboardData();
    
    /**
     * 获取销售日报
     */
    SalesReportDTO getDailySalesReport();
    
    /**
     * 获取销售汇总
     */
    List<SalesReportDTO> getSalesSummary(ReportQueryRequest request);
    
    /**
     * 获取采购日报
     */
    PurchaseReportDTO getDailyPurchaseReport();
    
    /**
     * 获取采购汇总
     */
    List<PurchaseReportDTO> getPurchaseSummary(ReportQueryRequest request);
    
    /**
     * 获取库存报表
     */
    List<InventoryReportDTO> getInventoryList(ReportQueryRequest request);
    
    /**
     * 获取低库存预警
     */
    List<InventoryReportDTO> getLowStockWarning();
    
    /**
     * 获取呆滞库存
     */
    List<InventoryReportDTO> getIdleStock(Integer days);
    
    /**
     * 获取销售趋势
     */
    TrendDTO getSalesTrend(ReportQueryRequest request);
    
    /**
     * 获取采购趋势
     */
    TrendDTO getPurchaseTrend(ReportQueryRequest request);
    
    /**
     * 获取财务报表
     */
    FinanceReportDTO getFinanceSummary(ReportQueryRequest request);
}