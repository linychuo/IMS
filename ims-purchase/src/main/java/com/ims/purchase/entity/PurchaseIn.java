package com.ims.purchase.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 采购入库单实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("ims_purchase_in")
public class PurchaseIn extends BaseEntity {

    /**
     * 入库单编号
     */
    private String inNo;

    /**
     * 采购订单ID
     */
    private Long orderId;

    /**
     * 供应商ID
     */
    private Long supplierId;

    /**
     * 入库日期
     */
    private LocalDateTime inDate;

    /**
     * 入库金额
     */
    private BigDecimal totalAmount;

    /**
     * 入库状态 (1-待入库, 2-已入库, 3-已取消)
     */
    private Integer status;

    /**
     * 仓库ID
     */
    private Long warehouseId;

    /**
     * 库位ID
     */
    private Long locationId;

    /**
     * 操作人
     */
    private String operator;

    /**
     * 备注
     */
    private String remark;
}