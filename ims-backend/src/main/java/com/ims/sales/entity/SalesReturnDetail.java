package com.ims.sales.entity;

import com.ims.core.entity.BaseEntity;

import java.math.BigDecimal;

/**
 * 销售退货明细实体
 */
public class SalesReturnDetail extends BaseEntity {

    private Long returnId;
    private String returnNo;
    private Long outDetailId;
    private String productId;
    private Long warehouseId;
    private Long locationId;
    private String productName;
    private String spec;
    private String unit;
    private BigDecimal quantity;
    private BigDecimal price;
    private BigDecimal amount;
    private BigDecimal inQuantity;

    public Long getReturnId() { return returnId; }
    public void setReturnId(Long returnId) { this.returnId = returnId; }
    public String getReturnNo() { return returnNo; }
    public void setReturnNo(String returnNo) { this.returnNo = returnNo; }
    public Long getOutDetailId() { return outDetailId; }
    public void setOutDetailId(Long outDetailId) { this.outDetailId = outDetailId; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getSpec() { return spec; }
    public void setSpec(String spec) { this.spec = spec; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getInQuantity() { return inQuantity; }
    public void setInQuantity(BigDecimal inQuantity) { this.inQuantity = inQuantity; }
}