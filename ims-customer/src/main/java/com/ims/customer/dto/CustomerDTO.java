package com.ims.customer.dto;

import com.ims.common.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 客户DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CustomerDTO extends BaseDTO {

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
     * 类型名称
     */
    private String typeName;

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
     * 等级名称
     */
    private String levelName;

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

    /**
     * 应收金额
     */
    private BigDecimal totalReceivable;

    /**
     * 欠款金额
     */
    private BigDecimal debtAmount;
}