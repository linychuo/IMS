package com.ims.finance.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 银行收款认领实体
 */
@TableName("bank_receipt")
public class BankReceipt extends BaseEntity {

    /**
     * 收款单号
     */
    private String receiptNo;

    /**
     * 客户ID
     */
    private Long customerId;

    /**
     * 客户名称
     */
    private String customerName;

    /**
     * 收款金额
     */
    private BigDecimal amount;

    /**
     * 已认领金额
     */
    private BigDecimal claimedAmount;

    /**
     * 待认领金额
     */
    private BigDecimal pendingAmount;

    /**
     * 收款日期
     */
    private LocalDateTime receiptDate;

    /**
     * 银行账号
     */
    private String bankAccount;

    /**
     * 开户行
     */
    private String bankName;

    /**
     * 支付方式: 1-现金 2-银行转账 3-支付宝 4-微信 5-其他
     */
    private Integer payMethod;

    /**
     * 状态: 0-待认领 1-部分认领 2-已认领 3-异常
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;

    public String getReceiptNo() { return receiptNo; }
    public void setReceiptNo(String receiptNo) { this.receiptNo = receiptNo; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getClaimedAmount() { return claimedAmount; }
    public void setClaimedAmount(BigDecimal claimedAmount) { this.claimedAmount = claimedAmount; }
    public BigDecimal getPendingAmount() { return pendingAmount; }
    public void setPendingAmount(BigDecimal pendingAmount) { this.pendingAmount = pendingAmount; }
    public LocalDateTime getReceiptDate() { return receiptDate; }
    public void setReceiptDate(LocalDateTime receiptDate) { this.receiptDate = receiptDate; }
    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public Integer getPayMethod() { return payMethod; }
    public void setPayMethod(Integer payMethod) { this.payMethod = payMethod; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}