package com.ims.report.dto;

import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 仪表盘数据DTO
 */
@Data
public class DashboardDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    /** 今日销售额 */
    private BigDecimal todaySalesAmount;
    /** 今日采购额 */
    private BigDecimal todayPurchaseAmount;
    /** 今日收款 */
    private BigDecimal todayReceiveAmount;
    /** 今日付款 */
    private BigDecimal todayPaymentAmount;
    /** 本月销售额 */
    private BigDecimal monthSalesAmount;
    /** 本月采购额 */
    private BigDecimal monthPurchaseAmount;
    /** 库存总量 */
    private Integer totalInventoryCount;
    /** 库存预警数量 */
    private Integer warningInventoryCount;
    /** 待审核采购数 */
    private Integer pendingPurchaseCount;
    /** 待审核销售数 */
    private Integer pendingSalesCount;
    /** 待收款订单数 */
    private Integer pendingReceiveCount;
    /** 待付款订单数 */
    private Integer pendingPaymentCount;
    /** 销售人员业绩列表 */
    private List<SalesPerformanceDTO> salesPerformanceList;
    /** 热销商品列表 */
    private List<ProductSalesDTO> hotProductList;
    /** 销售趋势数据 */
    private List<TrendDataDTO> salesTrendList;
    /** 采购趋势数据 */
    private List<TrendDataDTO> purchaseTrendList;
    
    @Data
    public static class SalesPerformanceDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private String userName;
        private BigDecimal salesAmount;
        private Integer orderCount;
    }
    
    @Data
    public static class ProductSalesDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private Long productId;
        private String productName;
        private Integer salesQuantity;
    }
    
    @Data
    public static class TrendDataDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private String date;
        private BigDecimal amount;
    }
}