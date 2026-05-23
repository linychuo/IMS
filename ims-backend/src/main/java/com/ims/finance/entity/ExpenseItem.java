package com.ims.finance.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;

/**
 * 费用项目实体
 */
@TableName("expense_item")
public class ExpenseItem extends BaseEntity {

    /**
     * 项目代码
     */
    private String itemCode;

    /**
     * 项目名称
     */
    private String itemName;

    /**
     * 费用类型: 1-管理费用/2-销售费用/3-财务费用/4-其他
     */
    private Integer expenseType;

    /**
     * 是否启用: 0-禁用/1-启用
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;

    public String getItemCode() { return itemCode; }
    public void setItemCode(String itemCode) { this.itemCode = itemCode; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public Integer getExpenseType() { return expenseType; }
    public void setExpenseType(Integer expenseType) { this.expenseType = expenseType; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}