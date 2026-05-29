package com.ims.report.mapper;

import com.ims.report.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 报表数据Mapper
 */
@Mapper
public interface ReportMapper {
    
    /**
     * 获取仪表盘数据
     */
    DashboardDTO getDashboardData();
    
    /**
     * 获取今日销售数据
     */
    SalesReportDTO getTodaySalesData();
    
    /**
     * 获取今日采购数据
     */
    PurchaseReportDTO getTodayPurchaseData();
    
    /**
     * 获取销售汇总数据
     */
    List<SalesReportDTO> getSalesSummaryList(@Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);
    
    /**
     * 获取采购汇总数据
     */
    List<PurchaseReportDTO> getPurchaseSummaryList(@Param("startDate") LocalDate startDate, 
                                                  @Param("endDate") LocalDate endDate);
    
    /**
     * 获取库存报表数据
     */
    List<InventoryReportDTO> getInventoryList(@Param("warehouseId") Long warehouseId,
                                                @Param("productId") Long productId);
    
    /**
     * 获取低库存预警数据
     */
    List<InventoryReportDTO> getLowStockList();
    
    /**
     * 获取呆滞库存数据
     */
    List<InventoryReportDTO> getIdleStockList(@Param("days") Integer days);
    
    /**
     * 获取销售趋势数据
     */
    List<TrendDTO.TrendPointDTO> getSalesTrendList(@Param("startDate") LocalDate startDate, 
                                                 @Param("endDate") LocalDate endDate);
    
    /**
     * 获取采购趋势数据
     */
    List<TrendDTO.TrendPointDTO> getPurchaseTrendList(@Param("startDate") LocalDate startDate, 
                                                     @Param("endDate") LocalDate endDate);
    
    /**
     * 获取财务报表数据
     */
    FinanceReportDTO getFinanceSummary(@Param("startDate") LocalDate startDate,
                                     @Param("endDate") LocalDate endDate);

    /**
     * 获取客户分析汇总数据
     */
    List<CustomerAnalysisDTO> getCustomerAnalysisList(@Param("startDate") LocalDate startDate,
                                                      @Param("endDate") LocalDate endDate);

    /**
     * 获取单个客户分析数据
     */
    CustomerAnalysisDTO getCustomerAnalysisById(@Param("customerId") Long customerId);

    /**
     * 获取商品分析数据
     */
    List<ProductAnalysisDTO> getProductAnalysisList(@Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate);

    /**
     * 获取供应商分析汇总数据
     */
    List<SupplierAnalysisDTO> getSupplierAnalysisList(@Param("startDate") LocalDate startDate,
                                                     @Param("endDate") LocalDate endDate);

    /**
     * 获取单个供应商分析数据
     */
    SupplierAnalysisDTO getSupplierAnalysisById(@Param("supplierId") Long supplierId);

    /**
     * 获取库存周转分析数据
     */
    List<InventoryTurnoverDTO> getInventoryTurnoverList(@Param("startDate") LocalDate startDate,
                                                         @Param("endDate") LocalDate endDate);

    /**
     * 获取毛利分析数据
     */
    List<ProfitMarginDTO> getProfitMarginList(@Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate);

    /**
     * 查询历史销售数据（用于AI预测）
     */
    List<Map<String, Object>> getHistoricalSales(@Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);

    /**
     * 查询当前库存（用于AI预测）
     */
    List<Map<String, Object>> getCurrentInventory();

    /**
     * 获取回款统计数据
     */
    List<CollectionStatisticsDTO> getCollectionStatisticsList(@Param("startDate") LocalDate startDate,
                                                               @Param("endDate") LocalDate endDate);
}