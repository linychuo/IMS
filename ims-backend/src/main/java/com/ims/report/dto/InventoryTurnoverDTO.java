package com.ims.report.dto;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 库存周转分析DTO
 */
public class InventoryTurnoverDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long productId;
    private String productName;
    private String productCode;
    private String categoryName;
    private BigDecimal averageInventory;
    private BigDecimal salesCost;
    private BigDecimal dailySalesCost;
    private Integer turnoverDays;
    private BigDecimal turnoverCount;
    private BigDecimal currentStock;
    private String remark;

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

    public BigDecimal getAverageInventory() {
        return averageInventory;
    }

    public void setAverageInventory(BigDecimal averageInventory) {
        this.averageInventory = averageInventory;
    }

    public BigDecimal getSalesCost() {
        return salesCost;
    }

    public void setSalesCost(BigDecimal salesCost) {
        this.salesCost = salesCost;
    }

    public BigDecimal getDailySalesCost() {
        return dailySalesCost;
    }

    public void setDailySalesCost(BigDecimal dailySalesCost) {
        this.dailySalesCost = dailySalesCost;
    }

    public Integer getTurnoverDays() {
        return turnoverDays;
    }

    public void setTurnoverDays(Integer turnoverDays) {
        this.turnoverDays = turnoverDays;
    }

    public BigDecimal getTurnoverCount() {
        return turnoverCount;
    }

    public void setTurnoverCount(BigDecimal turnoverCount) {
        this.turnoverCount = turnoverCount;
    }

    public BigDecimal getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(BigDecimal currentStock) {
        this.currentStock = currentStock;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}