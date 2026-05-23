package com.ims.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 客户对账单DTO
 */
public class CustomerStatementDTO {

    private Long customerId;
    private String customerName;
    private LocalDate startDate;
    private LocalDate endDate;

    // 期初数据
    private BigDecimal initialReceivable;
    private BigDecimal initialPaid;
    private BigDecimal initialPending;

    // 本期发生
    private BigDecimal periodNewReceivable;
    private BigDecimal periodReceived;

    // 期末数据
    private BigDecimal finalReceivable;
    private BigDecimal finalPaid;
    private BigDecimal finalPending;

    // 应收明细
    private List<ReceivableDetail> receivables;

    // 收款明细
    private List<ReceiptDetail> receipts;

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public BigDecimal getInitialReceivable() {
        return initialReceivable;
    }

    public void setInitialReceivable(BigDecimal initialReceivable) {
        this.initialReceivable = initialReceivable;
    }

    public BigDecimal getInitialPaid() {
        return initialPaid;
    }

    public void setInitialPaid(BigDecimal initialPaid) {
        this.initialPaid = initialPaid;
    }

    public BigDecimal getInitialPending() {
        return initialPending;
    }

    public void setInitialPending(BigDecimal initialPending) {
        this.initialPending = initialPending;
    }

    public BigDecimal getPeriodNewReceivable() {
        return periodNewReceivable;
    }

    public void setPeriodNewReceivable(BigDecimal periodNewReceivable) {
        this.periodNewReceivable = periodNewReceivable;
    }

    public BigDecimal getPeriodReceived() {
        return periodReceived;
    }

    public void setPeriodReceived(BigDecimal periodReceived) {
        this.periodReceived = periodReceived;
    }

    public BigDecimal getFinalReceivable() {
        return finalReceivable;
    }

    public void setFinalReceivable(BigDecimal finalReceivable) {
        this.finalReceivable = finalReceivable;
    }

    public BigDecimal getFinalPaid() {
        return finalPaid;
    }

    public void setFinalPaid(BigDecimal finalPaid) {
        this.finalPaid = finalPaid;
    }

    public BigDecimal getFinalPending() {
        return finalPending;
    }

    public void setFinalPending(BigDecimal finalPending) {
        this.finalPending = finalPending;
    }

    public List<ReceivableDetail> getReceivables() {
        return receivables;
    }

    public void setReceivables(List<ReceivableDetail> receivables) {
        this.receivables = receivables;
    }

    public List<ReceiptDetail> getReceipts() {
        return receipts;
    }

    public void setReceipts(List<ReceiptDetail> receipts) {
        this.receipts = receipts;
    }

    public static class ReceivableDetail {
        private String orderNo;
        private LocalDate dueDate;
        private BigDecimal totalAmount;
        private BigDecimal paidAmount;
        private BigDecimal pendingAmount;
        private Integer overdueDays;
        private String status;

        public String getOrderNo() {
            return orderNo;
        }

        public void setOrderNo(String orderNo) {
            this.orderNo = orderNo;
        }

        public LocalDate getDueDate() {
            return dueDate;
        }

        public void setDueDate(LocalDate dueDate) {
            this.dueDate = dueDate;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
        }

        public BigDecimal getPaidAmount() {
            return paidAmount;
        }

        public void setPaidAmount(BigDecimal paidAmount) {
            this.paidAmount = paidAmount;
        }

        public BigDecimal getPendingAmount() {
            return pendingAmount;
        }

        public void setPendingAmount(BigDecimal pendingAmount) {
            this.pendingAmount = pendingAmount;
        }

        public Integer getOverdueDays() {
            return overdueDays;
        }

        public void setOverdueDays(Integer overdueDays) {
            this.overdueDays = overdueDays;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public static class ReceiptDetail {
        private String receiptNo;
        private LocalDateTime receiptDate;
        private BigDecimal amount;
        private String payMethod;
        private String remark;

        public String getReceiptNo() {
            return receiptNo;
        }

        public void setReceiptNo(String receiptNo) {
            this.receiptNo = receiptNo;
        }

        public LocalDateTime getReceiptDate() {
            return receiptDate;
        }

        public void setReceiptDate(LocalDateTime receiptDate) {
            this.receiptDate = receiptDate;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getPayMethod() {
            return payMethod;
        }

        public void setPayMethod(String payMethod) {
            this.payMethod = payMethod;
        }

        public String getRemark() {
            return remark;
        }

        public void setRemark(String remark) {
            this.remark = remark;
        }
    }
}