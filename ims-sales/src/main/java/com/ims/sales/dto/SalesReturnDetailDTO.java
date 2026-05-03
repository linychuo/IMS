package com.ims.sales.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 销售退货明细DTO
 */
@Data
public class SalesReturnDetailDTO {

    /**
     * ID
     */
    private String id;

    /**
     * 退货单ID
     */
    private String returnId;

    /**
     * 出库明细ID
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
     * 备注
     */
    private String remark;
}