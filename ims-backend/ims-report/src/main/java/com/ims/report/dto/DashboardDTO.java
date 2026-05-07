package com.ims.report.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 仪表盘数据DTO
 */
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

    public BigDecimal getTodaySalesAmount() {
        return todaySalesAmount;
    }

    public void setTodaySalesAmount(BigDecimal todaySalesAmount) {
        this.todaySalesAmount = todaySalesAmount;
    }

    public BigDecimal getTodayPurchaseAmount() {
        return todayPurchaseAmount;
    }

    public void setTodayPurchaseAmount(BigDecimal todayPurchaseAmount) {
        this.todayPurchaseAmount = todayPurchaseAmount;
    }

    public BigDecimal getTodayReceiveAmount() {
        return todayReceiveAmount;
    }

    public void setTodayReceiveAmount(BigDecimal todayReceiveAmount) {
        this.todayReceiveAmount = todayReceiveAmount;
    }

    public BigDecimal getTodayPaymentAmount() {
        return todayPaymentAmount;
    }

    public void setTodayPaymentAmount(BigDecimal todayPaymentAmount) {
        this.todayPaymentAmount = todayPaymentAmount;
    }

    public BigDecimal getMonthSalesAmount() {
        return monthSalesAmount;
    }

    public void setMonthSalesAmount(BigDecimal monthSalesAmount) {
        this.monthSalesAmount = monthSalesAmount;
    }

    public BigDecimal getMonthPurchaseAmount() {
        return monthPurchaseAmount;
    }

    public void setMonthPurchaseAmount(BigDecimal monthPurchaseAmount) {
        this.monthPurchaseAmount = monthPurchaseAmount;
    }

    public Integer getTotalInventoryCount() {
        return totalInventoryCount;
    }

    public void setTotalInventoryCount(Integer totalInventoryCount) {
        this.totalInventoryCount = totalInventoryCount;
    }

    public Integer getWarningInventoryCount() {
        return warningInventoryCount;
    }

    public void setWarningInventoryCount(Integer warningInventoryCount) {
        this.warningInventoryCount = warningInventoryCount;
    }

    public Integer getPendingPurchaseCount() {
        return pendingPurchaseCount;
    }

    public void setPendingPurchaseCount(Integer pendingPurchaseCount) {
        this.pendingPurchaseCount = pendingPurchaseCount;
    }

    public Integer getPendingSalesCount() {
        return pendingSalesCount;
    }

    public void setPendingSalesCount(Integer pendingSalesCount) {
        this.pendingSalesCount = pendingSalesCount;
    }

    public Integer getPendingReceiveCount() {
        return pendingReceiveCount;
    }

    public void setPendingReceiveCount(Integer pendingReceiveCount) {
        this.pendingReceiveCount = pendingReceiveCount;
    }

    public Integer getPendingPaymentCount() {
        return pendingPaymentCount;
    }

    public void setPendingPaymentCount(Integer pendingPaymentCount) {
        this.pendingPaymentCount = pendingPaymentCount;
    }

    public List<SalesPerformanceDTO> getSalesPerformanceList() {
        return salesPerformanceList;
    }

    public void setSalesPerformanceList(List<SalesPerformanceDTO> salesPerformanceList) {
        this.salesPerformanceList = salesPerformanceList;
    }

    public List<ProductSalesDTO> getHotProductList() {
        return hotProductList;
    }

    public void setHotProductList(List<ProductSalesDTO> hotProductList) {
        this.hotProductList = hotProductList;
    }

    public List<TrendDataDTO> getSalesTrendList() {
        return salesTrendList;
    }

    public void setSalesTrendList(List<TrendDataDTO> salesTrendList) {
        this.salesTrendList = salesTrendList;
    }

    public List<TrendDataDTO> getPurchaseTrendList() {
        return purchaseTrendList;
    }

    public void setPurchaseTrendList(List<TrendDataDTO> purchaseTrendList) {
        this.purchaseTrendList = purchaseTrendList;
    }

    public static class SalesPerformanceDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private String userName;
        private BigDecimal salesAmount;
        private Integer orderCount;

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public BigDecimal getSalesAmount() {
            return salesAmount;
        }

        public void setSalesAmount(BigDecimal salesAmount) {
            this.salesAmount = salesAmount;
        }

        public Integer getOrderCount() {
            return orderCount;
        }

        public void setOrderCount(Integer orderCount) {
            this.orderCount = orderCount;
        }
    }

    public static class ProductSalesDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private Long productId;
        private String productName;
        private Integer salesQuantity;

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public Integer getSalesQuantity() {
            return salesQuantity;
        }

        public void setSalesQuantity(Integer salesQuantity) {
            this.salesQuantity = salesQuantity;
        }
    }

    public static class TrendDataDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private String date;
        private BigDecimal amount;

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }
}