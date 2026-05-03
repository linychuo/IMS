package com.ims.finance.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class FinanceSummaryDTO {
    private Long id;                             // 客户/供应商ID
    private String name;                         // 名称
    private BigDecimal totalInAmount;            // 总收款/总付款
    private BigDecimal totalOutAmount;            // 总付款/总收款
    private BigDecimal netAmount;                // 净收支
    private Integer count;                      // 笔数
    private Integer pendingCount;               // 待审核数
}