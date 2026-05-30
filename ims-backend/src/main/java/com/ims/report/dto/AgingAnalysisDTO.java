package com.ims.report.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 应收应付账龄分析DTO
 */
public class AgingAnalysisDTO implements Serializable {

    private String summaryType; // RECEIVABLE / PAYABLE

    // 总体统计
    private BigDecimal totalAmount;
    private BigDecimal totalPending;
    private long orderCount;
    private long overdueCount;

    // 按账龄区间分组
    private List<AgingBucket> buckets;

    // 明细列表
    private List<AgingItem> items;

    public String getSummaryType() { return summaryType; }
    public void setSummaryType(String summaryType) { this.summaryType = summaryType; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public BigDecimal getTotalPending() { return totalPending; }
    public void setTotalPending(BigDecimal totalPending) { this.totalPending = totalPending; }
    public long getOrderCount() { return orderCount; }
    public void setOrderCount(long orderCount) { this.orderCount = orderCount; }
    public long getOverdueCount() { return overdueCount; }
    public void setOverdueCount(long overdueCount) { this.overdueCount = overdueCount; }
    public List<AgingBucket> getBuckets() { return buckets; }
    public void setBuckets(List<AgingBucket> buckets) { this.buckets = buckets; }
    public List<AgingItem> getItems() { return items; }
    public void setItems(List<AgingItem> items) { this.items = items; }

    public static class AgingBucket implements Serializable {
        private String bucketName; // 0-30天/31-60天/61-90天/90天以上
        private int minDays;
        private int maxDays;
        private BigDecimal amount;
        private long count;
        private BigDecimal percentage;

        public String getBucketName() { return bucketName; }
        public void setBucketName(String bucketName) { this.bucketName = bucketName; }
        public int getMinDays() { return minDays; }
        public void setMinDays(int minDays) { this.minDays = minDays; }
        public int getMaxDays() { return maxDays; }
        public void setMaxDays(int maxDays) { this.maxDays = maxDays; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
        public BigDecimal getPercentage() { return percentage; }
        public void setPercentage(BigDecimal percentage) { this.percentage = percentage; }
    }

    public static class AgingItem implements Serializable {
        private Long id;
        private String orderNo;
        private String partnerName; // 客户名称 or 供应商名称
        private BigDecimal totalAmount;
        private BigDecimal pendingAmount;
        private LocalDate dueDate;
        private int overdueDays;
        private String statusName;
        private Integer status;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getOrderNo() { return orderNo; }
        public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
        public String getPartnerName() { return partnerName; }
        public void setPartnerName(String partnerName) { this.partnerName = partnerName; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public BigDecimal getPendingAmount() { return pendingAmount; }
        public void setPendingAmount(BigDecimal pendingAmount) { this.pendingAmount = pendingAmount; }
        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
        public int getOverdueDays() { return overdueDays; }
        public void setOverdueDays(int overdueDays) { this.overdueDays = overdueDays; }
        public String getStatusName() { return statusName; }
        public void setStatusName(String statusName) { this.statusName = statusName; }
        public Integer getStatus() { return status; }
        public void setStatus(Integer status) { this.status = status; }
    }
}