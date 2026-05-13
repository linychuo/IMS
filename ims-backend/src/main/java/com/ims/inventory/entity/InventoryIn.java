package com.ims.inventory.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 入库单实体
 */
@TableName("inventory_in")
public class InventoryIn extends BaseEntity {

    private String inNo;
    private Integer inType;
    private Long orderId;
    private String orderNo;
    private Long supplierId;
    private String supplierName;
    private LocalDateTime inDate;
    private Long warehouseId;
    private String warehouseName;
    private Long inBy;
    private String inByName;
    private Integer status;
    private BigDecimal totalAmount;
    private String remark;
    private Long auditedBy;
    private LocalDateTime auditedAt;

    public String getInNo() { return inNo; }
    public void setInNo(String inNo) { this.inNo = inNo; }
    public Integer getInType() { return inType; }
    public void setInType(Integer inType) { this.inType = inType; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public LocalDateTime getInDate() { return inDate; }
    public void setInDate(LocalDateTime inDate) { this.inDate = inDate; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public String getWarehouseName() { return warehouseName; }
    public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
    public Long getInBy() { return inBy; }
    public void setInBy(Long inBy) { this.inBy = inBy; }
    public String getInByName() { return inByName; }
    public void setInByName(String inByName) { this.inByName = inByName; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public Long getAuditedBy() { return auditedBy; }
    public void setAuditedBy(Long auditedBy) { this.auditedBy = auditedBy; }
    public LocalDateTime getAuditedAt() { return auditedAt; }
    public void setAuditedAt(LocalDateTime auditedAt) { this.auditedAt = auditedAt; }
}
