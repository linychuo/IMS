package com.ims.customer.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 客户实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("ims_customer")
public class Customer extends BaseEntity {

    /**
     * 客户编码
     */
    private String code;

    /**
     * 客户名称
     */
    private String name;

    /**
     * 客户类型 (1-个人, 2-企业)
     */
    private Integer type;

    /**
     * 联系人
     */
    private String contact;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 手机号
     */
    private String mobile;

    /**
     * 电子邮箱
     */
    private String email;

    /**
     * 地址
     */
    private String address;

    /**
     * 客户等级 (1-VIP, 2-普通, 3-潜在)
     */
    private Integer level;

    /**
     * 信用额度
     */
    private BigDecimal creditLimit;

    /**
     * 应收账款
     */
    private BigDecimal receivableAmount;

    /**
     * 结账周期(天)
     */
    private Integer settlePeriod;

    /**
     * 开户银行
     */
    private String bankName;

    /**
     * 银行账号
     */
    private String bankAccount;

    /**
     * 税号
     */
    private String taxNo;

    /**
     * 状态 (0-启用, 1-停用)
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;
}