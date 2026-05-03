package com.ims.finance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FinanceStatDTO {
    private BigDecimal totalInAmount;      // 总收款金额
    private BigDecimal totalOutAmount;     // 总付款金额
    private BigDecimal netAmount;       // 净收支
    private Integer pendingInCount;    // 待审核收款数
    private Integer pendingOutCount;  // 待审核付款数
    private Integer totalInCount;       // 收款单总数
    private Integer totalOutCount;      // 付款单总数
}