package com.ims.sales.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 销售订单保存请求
 */
@Data
public class SalesOrderSaveRequest {

    /**
     * ID (更新时必填)
     */
    private String id;

    /**
     * 客户ID
     */
    @NotBlank(message = "客户ID不能为空")
    private String customerId;

    /**
     * 订单日期
     */
    private LocalDate orderDate;

    /**
     * 要求交货日期
     */
    private LocalDate expectedDate;

    /**
     * 优惠金额
     */
    private BigDecimal discountAmount;

    /**
     * 备注
     */
    private String remark;

    /**
     * 订单明细列表
     */
    @NotEmpty(message = "订单明细不能为空")
    private List<SalesOrderDetailRequest> details;

    /**
     * 订单明细
     */
    @Data
    public static class SalesOrderDetailRequest {
        /**
         * 明细ID (更新时必填)
         */
        private String id;

        /**
         * 商品ID
         */
        @NotBlank(message = "商品ID不能为空")
        private String productId;

        /**
         * 数量
         */
        @NotBlank(message = "数量不能为空")
        private BigDecimal quantity;

        /**
         * 单价
         */
        @NotBlank(message = "单价不能为空")
        private BigDecimal price;

        /**
         * 备注
         */
        private String remark;
    }
}