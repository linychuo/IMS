package com.ims.sales.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 销售出库明细实体
 */
@Data
public class SalesOutDetail {

    /**
     * 明细ID
     */
    private String id;

    /**
     * 出库单ID
     */
    private String outId;

    /**
     * 出库单号
     */
    private String outNo;

    /**
     * 订单明细ID
     */
    private String orderDetailId;

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
     * 出库数量
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
     * 创建时间
     */
    private LocalDateTime createdAt;
}