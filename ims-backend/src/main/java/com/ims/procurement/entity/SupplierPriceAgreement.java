package com.ims.procurement.entity;

import com.ims.core.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 供应商价格协议实体
 */
public class SupplierPriceAgreement extends BaseEntity {

    /**
     * 协议编号
     */
    private String agreementNo;

    /**
     * 协议名称
     */
    private String agreementName;

    /**
     * 供应商ID
     */
    private Long supplierId;

    /**
     * 供应商名称
     */
    private String supplierName;

    /**
     * 商品ID
     */
    private Long productId;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 商品编码
     */
    private String productCode;

    /**
     * 开始日期
     */
    private LocalDate startDate;

    /**
     * 结束日期
     */
    private LocalDate endDate;

    /**
     * 价格类型: 1-固定价/2-阶梯价
     */
    private Integer priceType;

    /**
     * 标准采购价
     */
    private BigDecimal standardPrice;

    /**
     * 阶梯数量区间1
     */
    private BigDecimal tier1Quantity;

    /**
     * 阶梯价格1
     */
    private BigDecimal tier1Price;

    /**
     * 阶梯数量区间2
     */
    private BigDecimal tier2Quantity;

    /**
     * 阶梯价格2
     */
    private BigDecimal tier2Price;

    /**
     * 阶梯数量区间3
     */
    private BigDecimal tier3Quantity;

    /**
     * 阶梯价格3
     */
    private BigDecimal tier3Price;

    /**
     * 状态: 0-禁用/1-启用
     */
    private Integer status = 1;

    /**
     * 备注
     */
    private String remark;

    public String getAgreementNo() { return agreementNo; }
    public void setAgreementNo(String agreementNo) { this.agreementNo = agreementNo; }
    public String getAgreementName() { return agreementName; }
    public void setAgreementName(String agreementName) { this.agreementName = agreementName; }
    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Integer getPriceType() { return priceType; }
    public void setPriceType(Integer priceType) { this.priceType = priceType; }
    public BigDecimal getStandardPrice() { return standardPrice; }
    public void setStandardPrice(BigDecimal standardPrice) { this.standardPrice = standardPrice; }
    public BigDecimal getTier1Quantity() { return tier1Quantity; }
    public void setTier1Quantity(BigDecimal tier1Quantity) { this.tier1Quantity = tier1Quantity; }
    public BigDecimal getTier1Price() { return tier1Price; }
    public void setTier1Price(BigDecimal tier1Price) { this.tier1Price = tier1Price; }
    public BigDecimal getTier2Quantity() { return tier2Quantity; }
    public void setTier2Quantity(BigDecimal tier2Quantity) { this.tier2Quantity = tier2Quantity; }
    public BigDecimal getTier2Price() { return tier2Price; }
    public void setTier2Price(BigDecimal tier2Price) { this.tier2Price = tier2Price; }
    public BigDecimal getTier3Quantity() { return tier3Quantity; }
    public void setTier3Quantity(BigDecimal tier3Quantity) { this.tier3Quantity = tier3Quantity; }
    public BigDecimal getTier3Price() { return tier3Price; }
    public void setTier3Price(BigDecimal tier3Price) { this.tier3Price = tier3Price; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}