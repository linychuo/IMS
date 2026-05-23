package com.ims.finance.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 客户对账单实体
 */
@TableName("customer_reconciliation")
public class CustomerReconciliation extends BaseEntity {

    /**
     * 对账单号
     */
    private String reconciliationNo;

    /**
     * 客户ID
     */
    private Long customerId;

    /**
     * 客户名称
     */
    private String customerName;

    /**
     * 开始日期
     */
    private LocalDate startDate;

    /**
     * 结束日期
     */
    private LocalDate endDate;

    /**
     * 期初应收
     */
    private BigDecimal openingAmount;

    /**
     * 本期应收
     */
    private BigDecimal periodReceivable;

    /**
     * 本期收款
     */
    private BigDecimal periodReceipt;

    /**
     * 期末应收
     */
    private BigDecimal closingAmount;

    /**
     * 状态: 1-待确认/2-已确认/3-有差异
     */
    private Integer status;

    /**
     * 确认时间
     */
    private LocalDateTime confirmTime;

    /**
     * 备注
     */
    private String remark;

    public String getReconciliationNo() { return reconciliationNo; }
    public void setReconciliationNo(String reconciliationNo) { this.reconciliationNo = reconciliationNo; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public BigDecimal getOpeningAmount() { return openingAmount; }
    public void setOpeningAmount(BigDecimal openingAmount) { this.openingAmount = openingAmount; }
    public BigDecimal getPeriodReceivable() { return periodReceivable; }
    public void setPeriodReceivable(BigDecimal periodReceivable) { this.periodReceivable = periodReceivable; }
    public BigDecimal getPeriodReceipt() { return periodReceipt; }
    public void setPeriodReceipt(BigDecimal periodReceipt) { this.periodReceipt = periodReceipt; }
    public BigDecimal getClosingAmount() { return closingAmount; }
    public void setClosingAmount(BigDecimal closingAmount) { this.closingAmount = closingAmount; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public LocalDateTime getConfirmTime() { return confirmTime; }
    public void setConfirmTime(LocalDateTime confirmTime) { this.confirmTime = confirmTime; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}