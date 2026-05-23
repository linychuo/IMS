package com.ims.report.dto;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 毛利分析DTO
 */
public class ProfitMarginDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long productId;
    private String productName;
    private String productCode;
    private String categoryName;
    private BigDecimal salesAmount;
    private BigDecimal salesCost;
    private BigDecimal grossProfit;
    private BigDecimal grossProfitRate;
    private BigDecimal salesQuantity;
    private BigDecimal avgUnitPrice;
    private BigDecimal avgUnitCost;
    private String period;

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

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getSalesAmount() {
        return salesAmount;
    }

    public void setSalesAmount(BigDecimal salesAmount) {
        this.salesAmount = salesAmount;
    }

    public BigDecimal getSalesCost() {
        return salesCost;
    }

    public void setSalesCost(BigDecimal salesCost) {
        this.salesCost = salesCost;
    }

    public BigDecimal getGrossProfit() {
        return grossProfit;
    }

    public void setGrossProfit(BigDecimal grossProfit) {
        this.grossProfit = grossProfit;
    }

    public BigDecimal getGrossProfitRate() {
        return grossProfitRate;
    }

    public void setGrossProfitRate(BigDecimal grossProfitRate) {
        this.grossProfitRate = grossProfitRate;
    }

    public BigDecimal getSalesQuantity() {
        return salesQuantity;
    }

    public void setSalesQuantity(BigDecimal salesQuantity) {
        this.salesQuantity = salesQuantity;
    }

    public BigDecimal getAvgUnitPrice() {
        return avgUnitPrice;
    }

    public void setAvgUnitPrice(BigDecimal avgUnitPrice) {
        this.avgUnitPrice = avgUnitPrice;
    }

    public BigDecimal getAvgUnitCost() {
        return avgUnitCost;
    }

    public void setAvgUnitCost(BigDecimal avgUnitCost) {
        this.avgUnitCost = avgUnitCost;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }
}