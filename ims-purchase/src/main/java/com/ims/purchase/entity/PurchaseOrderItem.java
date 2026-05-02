package com.ims.purchase.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 采购订单明细实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("ims_purchase_order_item")
public class PurchaseOrderItem extends BaseEntity {

    /**
     * 订单ID
     */
    private Long orderId;

    /**
     * 商品ID
     */
    private Long productId;

    /**
     * 商品编码
     */
    private String productCode;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 单位
     */
    private String unit;

    /**
     * 采购数量
     */
    private BigDecimal quantity;

    /**
     * 采购单价
     */
    private BigDecimal price;

    /**
     * 金额
     */
    private BigDecimal amount;

    /**
     * 已入库数量
     */
    private BigDecimal inboundQty;

    /**
     * 备注
     */
    private String remark;
}