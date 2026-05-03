package com.ims.sales.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 销售价格策略保存请求
 */
@Data
public class SalesPriceStrategySaveRequest {

    /**
     * ID (更新时必填)
     */
    private String id;

    /**
     * 策略编号
     */
    @NotBlank(message = "策略编号不能为空")
    private String strategyNo;

    /**
     * 策略名称
     */
    @NotBlank(message = "策略名称不能为空")
    private String strategyName;

    /**
     * 客户ID (可选，为空表示所有客户)
     */
    private String customerId;

    /**
     * 商品ID (可选，为空表示所有商品)
     */
    private String productId;

    /**
     * 商品分类ID (可选)
     */
    private String productCategoryId;

    /**
     * 开始日期
     */
    @NotBlank(message = "开始日期不能为空")
    private LocalDate startDate;

    /**
     * 结束日期
     */
    @NotBlank(message = "结束日期不能为空")
    private LocalDate endDate;

    /**
     * 价格类型: 1-固定价/2-折扣率
     */
    @NotBlank(message = "价格类型不能为空")
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
    private Integer status = 1;

    /**
     * 备注
     */
    private String remark;
}