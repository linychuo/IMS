package com.ims.finance.dto;

import java.math.BigDecimal;

public class FinanceStatDTO {
    private BigDecimal totalInAmount;      // 总收款金额
    private BigDecimal totalOutAmount;     // 总付款金额
    private BigDecimal netAmount;       // 净收支
    private Integer pendingInCount;    // 待审核收款数
    private Integer pendingOutCount;  // 待审核付款数
    private Integer totalInCount;       // 收款单总数
    private Integer totalOutCount;      // 付款单总数

    public BigDecimal getTotalInAmount() {
        return totalInAmount;
    }

    public void setTotalInAmount(BigDecimal totalInAmount) {
        this.totalInAmount = totalInAmount;
    }

    public BigDecimal getTotalOutAmount() {
        return totalOutAmount;
    }

    public void setTotalOutAmount(BigDecimal totalOutAmount) {
        this.totalOutAmount = totalOutAmount;
    }

    public BigDecimal getNetAmount() {
        return netAmount;
    }

    public void setNetAmount(BigDecimal netAmount) {
        this.netAmount = netAmount;
    }

    public Integer getPendingInCount() {
        return pendingInCount;
    }

    public void setPendingInCount(Integer pendingInCount) {
        this.pendingInCount = pendingInCount;
    }

    public Integer getPendingOutCount() {
        return pendingOutCount;
    }

    public void setPendingOutCount(Integer pendingOutCount) {
        this.pendingOutCount = pendingOutCount;
    }

    public Integer getTotalInCount() {
        return totalInCount;
    }

    public void setTotalInCount(Integer totalInCount) {
        this.totalInCount = totalInCount;
    }

    public Integer getTotalOutCount() {
        return totalOutCount;
    }

    public void setTotalOutCount(Integer totalOutCount) {
        this.totalOutCount = totalOutCount;
    }
}