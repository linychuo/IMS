package com.ims.procurement.entity;

import com.ims.common.entity.BaseEntity;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 采购入库单实体
 */
public class PurchaseIn extends BaseEntity {

    /**
     * 入库单编号
     */
    private String inNo;

    /**
     * 关联采购订单ID
     */
    private String orderId;

    /**
     * 关联采购订单号
     */
    private String orderNo;

    /**
     * 供应商ID
     */
    @NotNull
    private String supplierId;

    /**
     * 供应商名称
     */
    private String supplierName;

    /**
     * 入库日期
     */
    private LocalDate inDate;

    /**
     * 仓库ID
     */
    @NotNull
    private String warehouseId;

    /**
     * 仓库名称
     */
    private String warehouseName;

    /**
     * 入库人ID
     */
    private String inBy;

    /**
     * 入库人姓名
     */
    private String inByName;

    /**
     * 状态: 0-待入库/1-部分入库/2-已完成/9-已取消
     */
    private Integer status = 0;

    /**
     * 入库总金额
     */
    private BigDecimal totalAmount;

    /**
     * 备注
     */
    private String remark;

    /**
     * 审核人
     */
    private String auditedBy;

    /**
     * 审核时间
     */
    private LocalDateTime auditedAt;

    public String getInNo() {
        return inNo;
    }

    public void setInNo(String inNo) {
        this.inNo = inNo;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(String supplierId) {
        this.supplierId = supplierId;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public LocalDate getInDate() {
        return inDate;
    }

    public void setInDate(LocalDate inDate) {
        this.inDate = inDate;
    }

    public String getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(String warehouseId) {
        this.warehouseId = warehouseId;
    }

    public String getWarehouseName() {
        return warehouseName;
    }

    public void setWarehouseName(String warehouseName) {
        this.warehouseName = warehouseName;
    }

    public String getInBy() {
        return inBy;
    }

    public void setInBy(String inBy) {
        this.inBy = inBy;
    }

    public String getInByName() {
        return inByName;
    }

    public void setInByName(String inByName) {
        this.inByName = inByName;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getAuditedBy() {
        return auditedBy;
    }

    public void setAuditedBy(String auditedBy) {
        this.auditedBy = auditedBy;
    }

    public LocalDateTime getAuditedAt() {
        return auditedAt;
    }

    public void setAuditedAt(LocalDateTime auditedAt) {
        this.auditedAt = auditedAt;
    }
}