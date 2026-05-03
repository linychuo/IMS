package com.ims.finance.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 账户DTO
 */
@Data
public class AccountDTO {
    private Long id;
    private String accountNo;     // 账户编号
    private String accountName;   // 账户名称
    private Integer accountType; // 账户类型
    private String accountTypeName;// 账户类型名称
    private String bankName;      // 开户行
    private String bankAccount;  // 银行账号
    private BigDecimal balance; // 当前余额
    private Integer status;     // 状态
    private String statusName;  // 状态名称
    private String remark;      // 备注
}