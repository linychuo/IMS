package com.ims.procurement.entity;

import com.ims.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 供应商实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Supplier extends BaseEntity {

    /**
     * 供应商编码
     */
    private String supplierCode;

    /**
     * 供应商名称
     */
    private String supplierName;

    /**
     * 联系人
     */
    private String contact;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 联系地址
     */
    private String address;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 信用等级: 1-5A级
     */
    private Integer creditLevel = 3;

    /**
     * 应付金额
     */
    private BigDecimal payableAmount;

    /**
     * 已付金额
     */
    private BigDecimal paidAmount;

    /**
     * 状态: 0-正常/1-停用
     */
    private Integer status = 0;

    /**
     * 备注
     */
    private String remark;
}