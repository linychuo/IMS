package com.ims.procurement.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 更新采购订单请求
 */
@Data
public class UpdatePurchaseOrderRequest {

    /**
     * 供应商ID
     */
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
     * 更新人ID
     */
    private String updatedBy;
}