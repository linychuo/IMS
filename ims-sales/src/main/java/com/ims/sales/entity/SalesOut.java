package com.ims.sales.entity;

import com.ims.common.entity.BaseEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 销售出库单实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SalesOut extends BaseEntity {

    /**
     * 出库单编号
     */
    private String outNo;

    /**
     * 关联销售订单ID
     */
    private String orderId;

    /**
     * 关联销售订单号
     */
    private String orderNo;

    /**
     * 客户ID
     */
    @NotNull
    private String customerId;

    /**
     * 客户名称
     */
    private String customerName;

    /**
     * 出库日期
     */
    private LocalDate outDate;

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
     * 出库人ID
     */
    private String outBy;

    /**
     * 出库人姓名
     */
    private String outByName;

    /**
     * 状态: 0-待出库/1-部分出库/2-已完成/9-已取消
     */
    private Integer status = 0;

    /**
     * 出库总金额
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