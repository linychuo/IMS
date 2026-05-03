package com.ims.finance.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("account_transaction")
public class AccountTransaction extends BaseEntity {
    private Long accountId;           // 账户ID
    private String accountNo;         // 账户编号
    private Integer transType;       // 交易类型: 1-收款入账 2-付款出账 3-调整增加 4-调整减少
    private BigDecimal amount;       // 交易金额
    private Long refId;              // 相关单据ID(如FinanceIn/FinanceOut的ID)
    private String refNo;            // 相关单据号
    private String remark;          // 备注
    private Long creatorId;         // 经手人ID
}