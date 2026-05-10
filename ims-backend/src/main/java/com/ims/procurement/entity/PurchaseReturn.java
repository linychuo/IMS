package com.ims.procurement.entity;

import com.ims.core.entity.BaseEntity;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 采购退货单实体
 */
public class PurchaseReturn extends BaseEntity {

    private String returnNo;

    private Long purchaseInId;

    private String purchaseInNo;

    @NotNull
    private Long supplierId;

    private String supplierName;

    private LocalDate returnDate;

    @NotNull
    private Long warehouseId;

    private String warehouseName;

    private String returnBy;

    private String returnByName;

    private Integer status = 0;

    private BigDecimal totalAmount;

    private BigDecimal refundAmount;

    private String reason;

    private String remark;

    private String auditedBy;

    private LocalDateTime auditedAt;

    public String getReturnNo() {
        return returnNo;
    }

    public void setReturnNo(String returnNo) {
        this.returnNo = returnNo;
    }

    public Long getPurchaseInId() {
        return purchaseInId;
    }

    public void setPurchaseInId(Long purchaseInId) {
        this.purchaseInId = purchaseInId;
    }

    public String getPurchaseInNo() {
        return purchaseInNo;
    }

    public void setPurchaseInNo(String purchaseInNo) {
        this.purchaseInNo = purchaseInNo;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
        this.warehouseId = warehouseId;
    }

    public String getWarehouseName() {
        return warehouseName;
    }

    public void setWarehouseName(String warehouseName) {
        this.warehouseName = warehouseName;
    }

    public String getReturnBy() {
        return returnBy;
    }

    public void setReturnBy(String returnBy) {
        this.returnBy = returnBy;
    }

    public String getReturnByName() {
        return returnByName;
    }

    public void setReturnByName(String returnByName) {
        this.returnByName = returnByName;
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

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
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