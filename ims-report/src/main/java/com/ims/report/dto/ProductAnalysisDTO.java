package com.ims.report.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 商品分析 DTO
 */
public class ProductAnalysisDTO {

    /**
     * 商品ID
     */
    private Long productId;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 商品分类
     */
    private String categoryName;

    /**
     * 销售数量
     */
    private BigDecimal salesQuantity;

    /**
     * 销售金额
     */
    private BigDecimal salesAmount;

    /**
     * 采购数量
     */
    private BigDecimal purchaseQuantity;

    /**
     * 采购金额
     */
    private BigDecimal purchaseAmount;

    /**
     * 当前库存数量
     */
    private BigDecimal stockQuantity;

    /**
     * 库存金额
     */
    private BigDecimal stockAmount;

    /**
     * 毛利
     */
    private BigDecimal profit;

    /**
     * 毛利率
     */
    private BigDecimal profitRate;

    /**
     * 最后销售日期
     */
    private LocalDate lastSalesDate;

    // Getters and Setters

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

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getSalesQuantity() {
        return salesQuantity;
    }

    public void setSalesQuantity(BigDecimal salesQuantity) {
        this.salesQuantity = salesQuantity;
    }

    public BigDecimal getSalesAmount() {
        return salesAmount;
    }

    public void setSalesAmount(BigDecimal salesAmount) {
        this.salesAmount = salesAmount;
    }

    public BigDecimal getPurchaseQuantity() {
        return purchaseQuantity;
    }

    public void setPurchaseQuantity(BigDecimal purchaseQuantity) {
        this.purchaseQuantity = purchaseQuantity;
    }

    public BigDecimal getPurchaseAmount() {
        return purchaseAmount;
    }

    public void setPurchaseAmount(BigDecimal purchaseAmount) {
        this.purchaseAmount = purchaseAmount;
    }

    public BigDecimal getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(BigDecimal stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public BigDecimal getStockAmount() {
        return stockAmount;
    }

    public void setStockAmount(BigDecimal stockAmount) {
        this.stockAmount = stockAmount;
    }

    public BigDecimal getProfit() {
        return profit;
    }

    public void setProfit(BigDecimal profit) {
        this.profit = profit;
    }

    public BigDecimal getProfitRate() {
        return profitRate;
    }

    public void setProfitRate(BigDecimal profitRate) {
        this.profitRate = profitRate;
    }

    public LocalDate getLastSalesDate() {
        return lastSalesDate;
    }

    public void setLastSalesDate(LocalDate lastSalesDate) {
        this.lastSalesDate = lastSalesDate;
    }
}