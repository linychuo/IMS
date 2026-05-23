package com.ims.finance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 供应商对账单DTO
 */
public class SupplierStatementDTO {

    private Long supplierId;
    private String supplierName;
    private LocalDate startDate;
    private LocalDate endDate;

    // 期初数据
    private BigDecimal initialPayable;
    private BigDecimal initialPaid;
    private BigDecimal initialPending;

    // 本期发生
    private BigDecimal periodNewPayable;
    private BigDecimal periodPaid;

    // 期末数据
    private BigDecimal finalPayable;
    private BigDecimal finalPaid;
    private BigDecimal finalPending;

    // 应付明细
    private List<PayableDetail> payables;

    // 付款明细
    private List<PaymentDetail> payments;

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

    public BigDecimal getInitialPayable() {
        return initialPayable;
    }

    public void setInitialPayable(BigDecimal initialPayable) {
        this.initialPayable = initialPayable;
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

    public BigDecimal getPeriodNewPayable() {
        return periodNewPayable;
    }

    public void setPeriodNewPayable(BigDecimal periodNewPayable) {
        this.periodNewPayable = periodNewPayable;
    }

    public BigDecimal getPeriodPaid() {
        return periodPaid;
    }

    public void setPeriodPaid(BigDecimal periodPaid) {
        this.periodPaid = periodPaid;
    }

    public BigDecimal getFinalPayable() {
        return finalPayable;
    }

    public void setFinalPayable(BigDecimal finalPayable) {
        this.finalPayable = finalPayable;
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

    public List<PayableDetail> getPayables() {
        return payables;
    }

    public void setPayables(List<PayableDetail> payables) {
        this.payables = payables;
    }

    public List<PaymentDetail> getPayments() {
        return payments;
    }

    public void setPayments(List<PaymentDetail> payments) {
        this.payments = payments;
    }

    public static class PayableDetail {
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

    public static class PaymentDetail {
        private String paymentNo;
        private LocalDateTime paymentDate;
        private BigDecimal amount;
        private String payMethod;
        private String remark;

        public String getPaymentNo() {
            return paymentNo;
        }

        public void setPaymentNo(String paymentNo) {
            this.paymentNo = paymentNo;
        }

        public LocalDateTime getPaymentDate() {
            return paymentDate;
        }

        public void setPaymentDate(LocalDateTime paymentDate) {
            this.paymentDate = paymentDate;
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