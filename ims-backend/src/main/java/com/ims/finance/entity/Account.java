package com.ims.finance.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@TableName("account")
public class Account extends BaseEntity {
    private String accountName;      // 账户名称
    private Integer accountType;    // 账户类型: 1-现金 2-银行 3-支付宝 4-微信 5-其他
    private String bankName;        // 开户行
    private String bankAccount;      // 银行账号
    private BigDecimal balance;     // 当前余额
    private Integer status;         // 状态: 1-启用 2-停用
    private String remark;          // 备注

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public Integer getAccountType() {
        return accountType;
    }

    public void setAccountType(Integer accountType) {
        this.accountType = accountType;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(String bankAccount) {
        this.bankAccount = bankAccount;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}