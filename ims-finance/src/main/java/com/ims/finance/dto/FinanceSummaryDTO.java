package com.ims.finance.dto;

import java.math.BigDecimal;

public class FinanceSummaryDTO {
    private Long id;                             // 客户/供应商ID
    private String name;                         // 名称
    private BigDecimal totalInAmount;            // 总收款/总付款
    private BigDecimal totalOutAmount;            // 总付款/总收款
    private BigDecimal netAmount;                // 净收支
    private Integer count;                      // 笔数
    private Integer pendingCount;               // 待审核数

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

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

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Integer getPendingCount() {
        return pendingCount;
    }

    public void setPendingCount(Integer pendingCount) {
        this.pendingCount = pendingCount;
    }
}