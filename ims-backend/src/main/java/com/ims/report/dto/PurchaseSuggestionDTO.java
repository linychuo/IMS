package com.ims.report.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 采购建议DTO
 */
public class PurchaseSuggestionDTO implements Serializable {

    private Long productId;
    private String productName;
    private String productCode;

    /**
     * 当前库存
     */
    private BigDecimal currentStock;

    /**
     * 建议采购数量
     */
    private BigDecimal suggestedQuantity;

    /**
     * 预计库存耗尽日期
     */
    private LocalDate estimatedStockoutDate;

    /**
     * 建议采购日期
     */
    private LocalDate suggestedPurchaseDate;

    /**
     * 紧急程度: HIGH-高, MEDIUM-中, LOW-低
     */
    private String urgency;

    /**
     * 备注
     */
    private String remark;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public BigDecimal getCurrentStock() { return currentStock; }
    public void setCurrentStock(BigDecimal currentStock) { this.currentStock = currentStock; }
    public BigDecimal getSuggestedQuantity() { return suggestedQuantity; }
    public void setSuggestedQuantity(BigDecimal suggestedQuantity) { this.suggestedQuantity = suggestedQuantity; }
    public LocalDate getEstimatedStockoutDate() { return estimatedStockoutDate; }
    public void setEstimatedStockoutDate(LocalDate estimatedStockoutDate) { this.estimatedStockoutDate = estimatedStockoutDate; }
    public LocalDate getSuggestedPurchaseDate() { return suggestedPurchaseDate; }
    public void setSuggestedPurchaseDate(LocalDate suggestedPurchaseDate) { this.suggestedPurchaseDate = suggestedPurchaseDate; }
    public String getUrgency() { return urgency; }
    public void setUrgency(String urgency) { this.urgency = urgency; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}
