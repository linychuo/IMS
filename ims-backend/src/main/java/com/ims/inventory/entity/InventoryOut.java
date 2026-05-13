package com.ims.inventory.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 出库单实体
 */
@TableName("inventory_out")
public class InventoryOut extends BaseEntity {

    private String outNo;
    private Integer outType;
    private Long orderId;
    private String orderNo;
    private Long customerId;
    private String customerName;
    private LocalDateTime outDate;
    private Long warehouseId;
    private String warehouseName;
    private String outBy;
    private String outByName;
    private Integer status;
    private BigDecimal totalAmount;
    private String remark;
    private String auditedBy;
    private LocalDateTime auditedAt;

    public String getOutNo() { return outNo; }
    public void setOutNo(String outNo) { this.outNo = outNo; }
    public Integer getOutType() { return outType; }
    public void setOutType(Integer outType) { this.outType = outType; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public LocalDateTime getOutDate() { return outDate; }
    public void setOutDate(LocalDateTime outDate) { this.outDate = outDate; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public String getWarehouseName() { return warehouseName; }
    public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
    public String getOutBy() { return outBy; }
    public void setOutBy(String outBy) { this.outBy = outBy; }
    public String getOutByName() { return outByName; }
    public void setOutByName(String outByName) { this.outByName = outByName; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public String getAuditedBy() { return auditedBy; }
    public void setAuditedBy(String auditedBy) { this.auditedBy = auditedBy; }
    public LocalDateTime getAuditedAt() { return auditedAt; }
    public void setAuditedAt(LocalDateTime auditedAt) { this.auditedAt = auditedAt; }
}