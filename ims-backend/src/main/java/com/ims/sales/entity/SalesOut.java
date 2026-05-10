package com.ims.sales.entity;

import com.ims.core.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 销售出库单实体
 */
public class SalesOut extends BaseEntity {

    /**
     * 出库单编号
     */
    private String outNo;

    /**
     * 关联销售订单ID
     */
    private Long orderId;

    /**
     * 关联销售订单号
     */
    private String orderNo;

    /**
     * 客户ID
     */
    private Long customerId;

    /**
     * 客户名称
     */
    private String customerName;

    /**
     * 出库日期
     */
    private LocalDate outDate;

    /**
     * 仓库ID
     */
    private Long warehouseId;

    /**
     * 仓库名称
     */
    private String warehouseName;

    /**
     * 出库人ID
     */
    private String outBy;

    /**
     * 出库人姓名
     */
    private String outByName;

    /**
     * 状态: 0-待出库/1-部分出库/2-已完成/9-已取消
     */
    private Integer status = 0;

    /**
     * 出库总金额
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

    public String getOutNo() { return outNo; }
    public void setOutNo(String outNo) { this.outNo = outNo; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public LocalDate getOutDate() { return outDate; }
    public void setOutDate(LocalDate outDate) { this.outDate = outDate; }
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