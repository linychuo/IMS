package com.ims.finance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class FinanceTrendDTO {
    private List<MonthlyStat> monthlyStats;     // 月度趋势
    private BigDecimal growthRate;              // 增长率
    private Integer totalMonths;                // 统计月数

    @Data
    public static class MonthlyStat {
        private String month;                    // 月份 (yyyy-MM)
        private BigDecimal inAmount;              // 收款金额
        private BigDecimal outAmount;             // 付款金额
        private BigDecimal netAmount;             // 净收支
        private Integer inCount;                 // 收款笔数
        private Integer outCount;                 // 付款笔数
    }
}