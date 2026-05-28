package com.ims.report.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 库存预警DTO
 */
public class InventoryAlertDTO implements Serializable {

    private Long productId;
    private String productName;
    private String productCode;

    /**
     * 预警类型: LOW_STOCK-低库存, OVERSTOCK-高库存, EXPIRY-过期风险, STAGNANT-滞销
     */
    private String alertType;

    /**
     * 当前库存
     */
    private BigDecimal currentStock;

    /**
     * 预警阈值
     */
    private BigDecimal threshold;

    /**
     * 预警日期
     */
    private LocalDate alertDate;

    /**
     * 预警说明
     */
    private String message;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public String getAlertType() { return alertType; }
    public void setAlertType(String alertType) { this.alertType = alertType; }
    public BigDecimal getCurrentStock() { return currentStock; }
    public void setCurrentStock(BigDecimal currentStock) { this.currentStock = currentStock; }
    public BigDecimal getThreshold() { return threshold; }
    public void setThreshold(BigDecimal threshold) { this.threshold = threshold; }
    public LocalDate getAlertDate() { return alertDate; }
    public void setAlertDate(LocalDate alertDate) { this.alertDate = alertDate; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
