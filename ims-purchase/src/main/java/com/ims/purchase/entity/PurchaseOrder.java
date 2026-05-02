package com.ims.purchase.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 采购订单实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("ims_purchase_order")
public class PurchaseOrder extends BaseEntity {

    /**
     * 订单编号
     */
    private String orderNo;

    /**
     * 供应商ID
     */
    private Long supplierId;

    /**
     * 订单日期
     */
    private LocalDateTime orderDate;

    /**
     * 订单金额
     */
    private BigDecimal totalAmount;

    /**
     * 实付金额
     */
    private BigDecimal paidAmount;

    /**
     * 优惠金额
     */
    private BigDecimal discountAmount;

    /**
     * 订单状态 (1-待确认, 2-已确认, 3-已入库, 4-已完成, 5-已取消)
     */
    private Integer status;

    /**
     * 采购员
     */
    private String purchaser;

    /**
     * 预计到货日期
     */
    private LocalDateTime expectDate;

    /**
     * 到货日期
     */
    private LocalDateTime arrivalDate;

    /**
     * 备注
     */
    private String remark;
}