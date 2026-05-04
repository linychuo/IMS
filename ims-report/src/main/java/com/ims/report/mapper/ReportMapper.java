package com.ims.report.mapper;

import com.ims.report.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.time.LocalDate;
import java.util.List;

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
}