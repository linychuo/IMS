package com.ims.procurement.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 更新采购订单请求
 */
public class UpdatePurchaseOrderRequest {

    private Long supplierId;
    private LocalDate expectedDate;
    private String remark;
    private BigDecimal discountAmount;

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public LocalDate getExpectedDate() {
        return expectedDate;
    }

    public void setExpectedDate(LocalDate expectedDate) {
        this.expectedDate = expectedDate;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }
}