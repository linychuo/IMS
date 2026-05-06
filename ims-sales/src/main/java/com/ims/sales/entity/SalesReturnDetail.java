package com.ims.sales.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 销售退货明细实体
 */
public class SalesReturnDetail {

    /**
     * 明细ID
     */
    private String id;

    /**
     * 退货单ID
     */
    private String returnId;

    /**
     * 退货单编号
     */
    private String returnNo;

    /**
     * 关联销售出库明细ID
     */
    private String outDetailId;

    /**
     * 商品ID
     */
    private String productId;

    /**
     * 仓库ID
     */
    private String warehouseId;

    /**
     * 库位ID
     */
    private String locationId;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 商品规格
     */
    private String spec;

    /**
     * 单位
     */
    private String unit;

    /**
     * 退货数量
     */
    private BigDecimal quantity;

    /**
     * 单价
     */
    private BigDecimal price;

    /**
     * 金额
     */
    private BigDecimal amount;

    /**
     * 已入库数量
     */
    private BigDecimal inQuantity;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getReturnId() { return returnId; }
    public void setReturnId(String returnId) { this.returnId = returnId; }
    public String getReturnNo() { return returnNo; }
    public void setReturnNo(String returnNo) { this.returnNo = returnNo; }
    public String getOutDetailId() { return outDetailId; }
    public void setOutDetailId(String outDetailId) { this.outDetailId = outDetailId; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getWarehouseId() { return warehouseId; }
    public void setWarehouseId(String warehouseId) { this.warehouseId = warehouseId; }
    public String getLocationId() { return locationId; }
    public void setLocationId(String locationId) { this.locationId = locationId; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}