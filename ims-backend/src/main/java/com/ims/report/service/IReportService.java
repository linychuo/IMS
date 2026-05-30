package com.ims.report.service;

import com.ims.report.dto.*;
import java.util.List;

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

    /**
     * 获取客户分析汇总
     */
    List<CustomerAnalysisDTO> getCustomerAnalysis(java.time.LocalDate startDate, java.time.LocalDate endDate);

    /**
     * 获取单个客户分析
     */
    CustomerAnalysisDTO getCustomerAnalysisById(Long customerId);

    /**
     * 获取商品分析
     */
    List<ProductAnalysisDTO> getProductAnalysis(java.time.LocalDate startDate, java.time.LocalDate endDate);

    /**
     * 获取供应商分析汇总
     */
    List<SupplierAnalysisDTO> getSupplierAnalysis(java.time.LocalDate startDate, java.time.LocalDate endDate);

    /**
     * 获取单个供应商分析
     */
    SupplierAnalysisDTO getSupplierAnalysisById(Long supplierId);

    /**
     * 获取库存周转分析
     */
    List<InventoryTurnoverDTO> getInventoryTurnover(java.time.LocalDate startDate, java.time.LocalDate endDate);

    /**
     * 获取毛利分析
     */
    List<ProfitMarginDTO> getProfitMargin(java.time.LocalDate startDate, java.time.LocalDate endDate);

    /**
     * 获取回款统计
     */
    java.util.List<CollectionStatisticsDTO> getCollectionStatistics(java.time.LocalDate startDate, java.time.LocalDate endDate);

    /**
     * 获取应收账龄分析
     */
    AgingAnalysisDTO getReceivableAging();

    /**
     * 获取应付账龄分析
     */
    AgingAnalysisDTO getPayableAging();
}