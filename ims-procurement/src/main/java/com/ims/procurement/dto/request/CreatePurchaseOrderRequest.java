package com.ims.procurement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 创建采购订单请求
 */
@Data
public class CreatePurchaseOrderRequest {

    /**
     * 供应商ID
     */
    @NotBlank
    private String supplierId;

    /**
     * 预计到货日期
     */
    private LocalDate expectedDate;

    /**
     * 备注
     */
    private String remark;

    /**
     * 优惠金额
     */
    private BigDecimal discountAmount;

    /**
     * 明细列表
     */
    @NotNull
    private List<PurchaseOrderDetailRequest> details;

    /**
     * 订单明细请求
     */
    @Data
    public static class PurchaseOrderDetailRequest {
        @NotBlank
        private String productId;
        private String batchNo;
        private String unitId;
        @NotNull
        private BigDecimal price;
        @NotNull
        private BigDecimal quantity;
        private String remark;
    }
}