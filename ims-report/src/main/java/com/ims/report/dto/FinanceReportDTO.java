package com.ims.report.dto;

import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 财务报表DTO
 */
@Data
public class FinanceReportDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long id;
    private LocalDate reportDate;
    private String reportType;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netProfit;
    private Integer accountCount;
    private List<AccountSummaryDTO> accountSummaryList;
    
    @Data
    public static class AccountSummaryDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private Long accountId;
        private String accountName;
        private BigDecimal balance;
    }
}