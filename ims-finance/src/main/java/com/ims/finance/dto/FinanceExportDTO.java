package com.ims.finance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class FinanceExportDTO {
    private String no;                           // 单号
    private Integer type;                       // 类型: 1-收款 2-付款
    private Integer status;                     // 状态
    private BigDecimal amount;                  // 金额
    private String customerName;                // 客户名称
    private String supplierName;                // 供应商名称
    private String accountName;                 // 账户名称
    private String payMethod;                    // 支付方式
    private LocalDateTime payDate;               // 付款日期
    private String remark;                       // 备注
}