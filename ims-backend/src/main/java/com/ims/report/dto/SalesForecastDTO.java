package com.ims.report.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 销售预测DTO
 */
public class SalesForecastDTO implements Serializable {

    private Long productId;
    private String productName;
    private String productCode;

    /**
     * 预测日期
     */
    private LocalDate date;

    /**
     * 预测销量
     */
    private BigDecimal forecastQuantity;

    /**
     * 预测销量下限
     */
    private BigDecimal lowerBound;

    /**
     * 预测销量上限
     */
    private BigDecimal upperBound;

    /**
     * 置信度
     */
    private Double confidence;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public BigDecimal getForecastQuantity() { return forecastQuantity; }
    public void setForecastQuantity(BigDecimal forecastQuantity) { this.forecastQuantity = forecastQuantity; }
    public BigDecimal getLowerBound() { return lowerBound; }
    public void setLowerBound(BigDecimal lowerBound) { this.lowerBound = lowerBound; }
    public BigDecimal getUpperBound() { return upperBound; }
    public void setUpperBound(BigDecimal upperBound) { this.upperBound = upperBound; }
    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }
}
