package com.ims.finance.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 供应商对账单实体
 */
@TableName("supplier_reconciliation")
public class SupplierReconciliation extends BaseEntity {

    /**
     * 对账单号
     */
    private String reconciliationNo;

    /**
     * 供应商ID
     */
    private Long supplierId;

    /**
     * 供应商名称
     */
    private String supplierName;

    /**
     * 开始日期
     */
    private LocalDate startDate;

    /**
     * 结束日期
     */
    private LocalDate endDate;

    /**
     * 期初应付
     */
    private BigDecimal openingAmount;

    /**
     * 本期应付
     */
    private BigDecimal periodPayable;

    /**
     * 本期付款
     */
    private BigDecimal periodPayment;

    /**
     * 期末应付
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
    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public BigDecimal getOpeningAmount() { return openingAmount; }
    public void setOpeningAmount(BigDecimal openingAmount) { this.openingAmount = openingAmount; }
    public BigDecimal getPeriodPayable() { return periodPayable; }
    public void setPeriodPayable(BigDecimal periodPayable) { this.periodPayable = periodPayable; }
    public BigDecimal getPeriodPayment() { return periodPayment; }
    public void setPeriodPayment(BigDecimal periodPayment) { this.periodPayment = periodPayment; }
    public BigDecimal getClosingAmount() { return closingAmount; }
    public void setClosingAmount(BigDecimal closingAmount) { this.closingAmount = closingAmount; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public LocalDateTime getConfirmTime() { return confirmTime; }
    public void setConfirmTime(LocalDateTime confirmTime) { this.confirmTime = confirmTime; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}