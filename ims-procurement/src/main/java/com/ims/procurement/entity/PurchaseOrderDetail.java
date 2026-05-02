package com.ims.procurement.entity;

import com.ims.common.entity.BaseEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 采购订单明细实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PurchaseOrderDetail extends BaseEntity {

    /**
     * 订单ID
     */
    @NotNull
    private String orderId;

    /**
     * 商品ID
     */
    @NotNull
    private String productId;

    /**
     * 商品名称 (冗余)
     */
    private String productName;

    /**
     * 商品编码
     */
    private String productCode;

    /**
     * 批次号
     */
    private String batchNo;

    /**
     * 单位ID
     */
    private String unitId;

    /**
     * 单位名称
     */
    private String unitName;

    /**
     * 采购单价
     */
    @NotNull
    private BigDecimal price;

    /**
     * 采购数量
     */
    @NotNull
    private BigDecimal quantity;

    /**
     * 金额 = 单价 * 数量
     */
    private BigDecimal amount;

    /**
     * 已发货数量
     */
    private BigDecimal deliveredQty;

    /**
     * 已入库数量
     */
    private BigDecimal receivedQty;

    /**
     * 备注
     */
    private String remark;
}