package com.ims.finance.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import java.math.BigDecimal;

@Data
@TableName("account")
public class Account extends BaseEntity {
    private String accountNo;        // 账户编号
    private String accountName;      // 账户名称
    private Integer accountType;    // 账户类型: 1-现金 2-银行 3-支付宝 4-微信 5-其他
    private String bankName;        // 开户行
    private String bankAccount;      // 银行账号
    private BigDecimal balance;     // 当前余额
    private Integer status;         // 状态: 1-启用 2-停用
    private String remark;          // 备注
}