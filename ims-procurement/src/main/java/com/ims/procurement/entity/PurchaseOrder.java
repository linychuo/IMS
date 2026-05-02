package com.ims.procurement.entity;

import com.ims.common.entity.BaseEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 采购订单实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PurchaseOrder extends BaseEntity {

    /**
     * 订单编号
     */
    private String orderNo;

    /**
     * 供应商ID
     */
    @NotNull
    private String supplierId;

    /**
     * 供应商名称 (冗余)
     */
    private String supplierName;

    /**
     * 订单日期
     */
    private java.time.LocalDate orderDate;

    /**
     * 预计到货日期
     */
    private java.time.LocalDate expectedDate;

    /**
     * 状态: 0新建/1待审核/2已审核/3待发货/4部分发货/5已完成/9已取消
     */
    private Integer status = 0;

    /**
     * 订单总金额
     */
    private java.math.BigDecimal totalAmount;

    /**
     * 优惠金额
     */
    private java.math.BigDecimal discountAmount;

    /**
     * 应付金额
     */
    private java.math.BigDecimal netAmount;

    /**
     * 备注
     */
    private String remark;

    /**
     * 审核人ID
     */
    private String auditedBy;

    /**
     * 审核时间
     */
    private java.time.LocalDateTime auditedAt;
}