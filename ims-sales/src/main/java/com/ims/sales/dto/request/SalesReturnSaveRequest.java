package com.ims.sales.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 销售退货单保存请求
 */
@Data
public class SalesReturnSaveRequest {

    /**
     * ID (更新时必填)
     */
    private String id;

    /**
     * 关联销售订单ID
     */
    private String orderId;

    /**
     * 关联销售出库单ID
     */
    private String outId;

    /**
     * 客户ID
     */
    @NotBlank(message = "客户ID不能为空")
    private String customerId;

    /**
     * 退货日期
     */
    private LocalDate returnDate;

    /**
     * 仓库ID
     */
    @NotBlank(message = "仓库ID不能为空")
    private String warehouseId;

    /**
     * 退货原因
     */
    private String reason;

    /**
     * 备注
     */
    private String remark;

    /**
     * 退货明细列表
     */
    @NotEmpty(message = "退货明细不能为空")
    private List<SalesReturnDetailRequest> details;

    /**
     * 退货明细
     */
    @Data
    public static class SalesReturnDetailRequest {
        /**
         * 明细ID (更新时必填)
         */
        private String id;

        /**
         * 出库明细ID
         */
        @NotBlank(message = "出库明细ID不能为空")
        private String outDetailId;

        /**
         * 商品ID
         */
        @NotBlank(message = "商品ID不能为空")
        private String productId;

        /**
         * 退货数量
         */
        @NotBlank(message = "退货数量不能为空")
        private BigDecimal quantity;

        /**
         * 单价
         */
        private BigDecimal price;

        /**
         * 备注
         */
        private String remark;
    }
}