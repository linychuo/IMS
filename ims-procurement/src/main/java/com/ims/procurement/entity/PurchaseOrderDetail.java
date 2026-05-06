package com.ims.procurement.entity;

import com.ims.common.entity.BaseEntity;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/**
 * 采购订单明细实体
 */
public class PurchaseOrderDetail extends BaseEntity {

    /**
     * 订单ID
     */
    @NotNull
    private String orderId;

    /**
     * 商品ID
     */
    @NotNull
    private String productId;

    /**
     * 商品名称 (冗余)
     */
    private String productName;

    /**
     * 商品编码
     */
    private String productCode;

    /**
     * 批次号
     */
    private String batchNo;

    /**
     * 单位ID
     */
    private String unitId;

    /**
     * 单位名称
     */
    private String unitName;

    /**
     * 采购单价
     */
    @NotNull
    private BigDecimal price;

    /**
     * 采购数量
     */
    @NotNull
    private BigDecimal quantity;

    /**
     * 金额 = 单价 * 数量
     */
    private BigDecimal amount;

    /**
     * 已发货数量
     */
    private BigDecimal deliveredQty;

    /**
     * 已入库数量
     */
    private BigDecimal receivedQty;

    /**
     * 备注
     */
    private String remark;

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
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

    public String getBatchNo() {
        return batchNo;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    public String getUnitId() {
        return unitId;
    }

    public void setUnitId(String unitId) {
        this.unitId = unitId;
    }

    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getDeliveredQty() {
        return deliveredQty;
    }

    public void setDeliveredQty(BigDecimal deliveredQty) {
        this.deliveredQty = deliveredQty;
    }

    public BigDecimal getReceivedQty() {
        return receivedQty;
    }

    public void setReceivedQty(BigDecimal receivedQty) {
        this.receivedQty = receivedQty;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}