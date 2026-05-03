package com.ims.sales.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 销售退货明细实体
 */
@Data
public class SalesReturnDetail {

    /**
     * 明细ID
     */
    private String id;

    /**
     * 退货单ID
     */
    private String returnId;

    /**
     * 退货单编号
     */
    private String returnNo;

    /**
     * 关联销售出库明细ID
     */
    private String outDetailId;

    /**
     * 商品ID
     */
    private String productId;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 商品规格
     */
    private String spec;

    /**
     * 单位
     */
    private String unit;

    /**
     * 退货数量
     */
    private BigDecimal quantity;

    /**
     * 单价
     */
    private BigDecimal price;

    /**
     * 金额
     */
    private BigDecimal amount;

    /**
     * 已入库数量
     */
    private BigDecimal inQuantity;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;
}