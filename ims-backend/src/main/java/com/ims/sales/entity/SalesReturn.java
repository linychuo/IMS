package com.ims.sales.entity;

import com.ims.core.entity.BaseEntity;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 销售退货单实体
 */
public class SalesReturn extends BaseEntity {

    /**
     * 退货单编号
     */
    private String returnNo;

    /**
     * 关联销售订单ID
     */
    private Long orderId;

    /**
     * 关联销售订单号
     */
    private String orderNo;

    /**
     * 关联销售出库单ID
     */
    private Long outId;

    /**
     * 关联销售出库单号
     */
    private String outNo;

    /**
     * 客户ID
     */
    private Long customerId;

    /**
     * 客户名称
     */
    private String customerName;

    /**
     * 退货日期
     */
    private LocalDate returnDate;

    /**
     * 仓库ID
     */
    private Long warehouseId;

    /**
     * 仓库名称
     */
    private String warehouseName;

    /**
     * 退货人ID
     */
    private String returnBy;

    /**
     * 退货人姓名
     */
    private String returnByName;

    /**
     * 状态: 0-待审核/1-已审核/2-已入库/9-已拒绝
     */
    private Integer status = 0;

    /**
     * 退货总金额
     */
    private BigDecimal totalAmount;

    /**
     * 退款金额
     */
    private BigDecimal refundAmount;

    /**
     * 退货原因
     */
    private String reason;

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

    public String getReturnNo() { return returnNo; }
    public void setReturnNo(String returnNo) { this.returnNo = returnNo; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
    public Long getOutId() { return outId; }
    public void setOutId(Long outId) { this.outId = outId; }
    public String getOutNo() { return outNo; }
    public void setOutNo(String outNo) { this.outNo = outNo; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public String getWarehouseName() { return warehouseName; }
    public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
    public String getReturnBy() { return returnBy; }
    public void setReturnBy(String returnBy) { this.returnBy = returnBy; }
    public String getReturnByName() { return returnByName; }
    public void setReturnByName(String returnByName) { this.returnByName = returnByName; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getRefundAmount() { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public String getAuditedBy() { return auditedBy; }
    public void setAuditedBy(String auditedBy) { this.auditedBy = auditedBy; }
    public LocalDateTime getAuditedAt() { return auditedAt; }
    public void setAuditedAt(LocalDateTime auditedAt) { this.auditedAt = auditedAt; }
}