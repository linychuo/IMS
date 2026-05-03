package com.ims.sales.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 销售价格策略DTO
 */
@Data
public class SalesPriceStrategyDTO {

    /**
     * ID
     */
    private String id;

    /**
     * 策略编号
     */
    private String strategyNo;

    /**
     * 策略名称
     */
    private String strategyName;

    /**
     * 客户ID
     */
    private String customerId;

    /**
     * 客户名称
     */
    private String customerName;

    /**
     * 商品ID
     */
    private String productId;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 商品分类ID
     */
    private String productCategoryId;

    /**
     * 商品分类名称
     */
    private String productCategoryName;

    /**
     * 开始日期
     */
    private LocalDate startDate;

    /**
     * 结束日期
     */
    private LocalDate endDate;

    /**
     * 价格类型: 1-固定价/2-折扣率
     */
    private Integer priceType;

    /**
     * 价格
     */
    private BigDecimal price;

    /**
     * 折扣率
     */
    private BigDecimal discountRate;

    /**
     * 状态: 0-禁用/1-启用
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建时间
     */
    private String createdAt;

    /**
     * 更新时间
     */
    private String updatedAt;
}