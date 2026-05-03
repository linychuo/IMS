package com.ims.sales.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 销售出库明细DTO
 */
@Data
public class SalesOutDetailDTO {

    /**
     * ID
     */
    private String id;

    /**
     * 出库单ID
     */
    private String outId;

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
     * 商品编码
     */
    private String productCode;

    /**
     * 单位ID
     */
    private String unitId;

    /**
     * 单位名称
     */
    private String unitName;

    /**
     * 规格
     */
    private String spec;

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
     * 备注
     */
    private String remark;
}