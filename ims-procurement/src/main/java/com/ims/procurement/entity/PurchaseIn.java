package com.ims.procurement.entity;

import com.ims.common.entity.BaseEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 采购入库单实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PurchaseIn extends BaseEntity {

    /**
     * 入库单编号
     */
    private String inNo;

    /**
     * 关联采购订单ID
     */
    private String orderId;

    /**
     * 关联采购订单号
     */
    private String orderNo;

    /**
     * 供应商ID
     */
    @NotNull
    private String supplierId;

    /**
     * 供应商名称
     */
    private String supplierName;

    /**
     * 入库日期
     */
    private LocalDate inDate;

    /**
     * 仓库ID
     */
    @NotNull
    private String warehouseId;

    /**
     * 仓库名称
     */
    private String warehouseName;

    /**
     * 入库人ID
     */
    private String inBy;

    /**
     * 入库人姓名
     */
    private String inByName;

    /**
     * 状态: 0-待入库/1-部分入库/2-已完成/9-已取消
     */
    private Integer status = 0;

    /**
     * 入库总金额
     */
    private BigDecimal totalAmount;

    /**
     * 备注
     */
    private String remark;

    /**
     * 审核人
     */
    private String auditedBy;

    /**
     * 审核时间
     */
    private LocalDateTime auditedAt;
}