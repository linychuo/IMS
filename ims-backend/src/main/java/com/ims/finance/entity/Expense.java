package com.ims.finance.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 费用管理实体
 */
@TableName("expense")
public class Expense extends BaseEntity {

    /**
     * 费用单号
     */
    private String expenseNo;

    /**
     * 费用类型: 1-管理费用/2-销售费用/3-财务费用/4-其他
     */
    private Integer expenseType;

    /**
     * 费用项目ID
     */
    private Long expenseItemId;

    /**
     * 费用项目名称
     */
    private String expenseItemName;

    /**
     * 关联部门ID
     */
    private Long departmentId;

    /**
     * 关联部门名称
     */
    private String departmentName;

    /**
     * 关联员工ID
     */
    private Long employeeId;

    /**
     * 关联员工名称
     */
    private String employeeName;

    /**
     * 发生日期
     */
    private LocalDate expenseDate;

    /**
     * 费用金额
     */
    private BigDecimal amount;

    /**
     * 税率
     */
    private BigDecimal taxRate;

    /**
     * 税额
     */
    private BigDecimal taxAmount;

    /**
     * 含税金额
     */
    private BigDecimal totalAmount;

    /**
     * 付款方式: 1-现金/2-银行转账/3-支付宝/4-微信/5-其他
     */
    private Integer payMethod;

    /**
     * 银行账号
     */
    private String bankAccount;

    /**
     * 开户行
     */
    private String bankName;

    /**
     * 状态: 1-待审核/2-已审核/3-已付款/4-已取消
     */
    private Integer status;

    /**
     * 审核人ID
     */
    private Long auditorId;

    /**
     * 审核时间
     */
    private LocalDateTime auditTime;

    /**
     * 付款时间
     */
    private LocalDateTime payTime;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建人ID
     */
    private Long creatorId;

    public String getExpenseNo() { return expenseNo; }
    public void setExpenseNo(String expenseNo) { this.expenseNo = expenseNo; }
    public Integer getExpenseType() { return expenseType; }
    public void setExpenseType(Integer expenseType) { this.expenseType = expenseType; }
    public Long getExpenseItemId() { return expenseItemId; }
    public void setExpenseItemId(Long expenseItemId) { this.expenseItemId = expenseItemId; }
    public String getExpenseItemName() { return expenseItemName; }
    public void setExpenseItemName(String expenseItemName) { this.expenseItemName = expenseItemName; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public LocalDate getExpenseDate() { return expenseDate; }
    public void setExpenseDate(LocalDate expenseDate) { this.expenseDate = expenseDate; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getTaxRate() { return taxRate; }
    public void setTaxRate(BigDecimal taxRate) { this.taxRate = taxRate; }
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public Integer getPayMethod() { return payMethod; }
    public void setPayMethod(Integer payMethod) { this.payMethod = payMethod; }
    public String getBankAccount() { return bankAccount; }
    public void setBankAccount(String bankAccount) { this.bankAccount = bankAccount; }
    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public Long getAuditorId() { return auditorId; }
    public void setAuditorId(Long auditorId) { this.auditorId = auditorId; }
    public LocalDateTime getAuditTime() { return auditTime; }
    public void setAuditTime(LocalDateTime auditTime) { this.auditTime = auditTime; }
    public LocalDateTime getPayTime() { return payTime; }
    public void setPayTime(LocalDateTime payTime) { this.payTime = payTime; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public Long getCreatorId() { return creatorId; }
    public void setCreatorId(Long creatorId) { this.creatorId = creatorId; }
}