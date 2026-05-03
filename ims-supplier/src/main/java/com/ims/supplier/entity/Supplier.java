package com.ims.supplier.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 供应商实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("ims_supplier")
public class Supplier extends BaseEntity {

    /**
     * 供应商编码
     */
    private String code;

    /**
     * 供应商名称
     */
    private String name;

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
     * 供应商等级 (1-A级, 2-B级, 3-C级)
     */
    private Integer level;

    /**
     * 信用额度
     */
    private BigDecimal creditLimit;

    /**
     * 应付账款
     */
    private BigDecimal payableAmount;

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