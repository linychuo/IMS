package com.ims.finance.dto;

import java.math.BigDecimal;
import java.util.List;

public class FinanceTrendDTO {
    private List<MonthlyStat> monthlyStats;     // 月度趋势
    private BigDecimal growthRate;              // 增长率
    private Integer totalMonths;                // 统计月数

    public List<MonthlyStat> getMonthlyStats() {
        return monthlyStats;
    }

    public void setMonthlyStats(List<MonthlyStat> monthlyStats) {
        this.monthlyStats = monthlyStats;
    }

    public BigDecimal getGrowthRate() {
        return growthRate;
    }

    public void setGrowthRate(BigDecimal growthRate) {
        this.growthRate = growthRate;
    }

    public Integer getTotalMonths() {
        return totalMonths;
    }

    public void setTotalMonths(Integer totalMonths) {
        this.totalMonths = totalMonths;
    }

    public static class MonthlyStat {
        private String month;                    // 月份 (yyyy-MM)
        private BigDecimal inAmount;              // 收款金额
        private BigDecimal outAmount;             // 付款金额
        private BigDecimal netAmount;             // 净收支
        private Integer inCount;                 // 收款笔数
        private Integer outCount;                 // 付款笔数

        public String getMonth() {
            return month;
        }

        public void setMonth(String month) {
            this.month = month;
        }

        public BigDecimal getInAmount() {
            return inAmount;
        }

        public void setInAmount(BigDecimal inAmount) {
            this.inAmount = inAmount;
        }

        public BigDecimal getOutAmount() {
            return outAmount;
        }

        public void setOutAmount(BigDecimal outAmount) {
            this.outAmount = outAmount;
        }

        public BigDecimal getNetAmount() {
            return netAmount;
        }

        public void setNetAmount(BigDecimal netAmount) {
            this.netAmount = netAmount;
        }

        public Integer getInCount() {
            return inCount;
        }

        public void setInCount(Integer inCount) {
            this.inCount = inCount;
        }

        public Integer getOutCount() {
            return outCount;
        }

        public void setOutCount(Integer outCount) {
            this.outCount = outCount;
        }
    }
}