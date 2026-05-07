package com.ims.procurement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 创建采购订单请求
 */
public class CreatePurchaseOrderRequest {

    /**
     * 供应商ID
     */
    @NotBlank
    private String supplierId;

    /**
     * 创建人ID
     */
    private String createdBy;

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

    public String getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(String supplierId) {
        this.supplierId = supplierId;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
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

    public List<PurchaseOrderDetailRequest> getDetails() {
        return details;
    }

    public void setDetails(List<PurchaseOrderDetailRequest> details) {
        this.details = details;
    }

    /**
     * 订单明细请求
     */
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

        public String getProductId() {
            return productId;
        }

        public void setProductId(String productId) {
            this.productId = productId;
        }

        public String getBatchNo() {
            return batchNo;
        }

        public void setBatchNo(String batchNo) {
            this.batchNo = batchNo;
        }

        public String getUnitId() {
            return unitId;
        }

        public void setUnitId(String unitId) {
            this.unitId = unitId;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public BigDecimal getQuantity() {
            return quantity;
        }

        public void setQuantity(BigDecimal quantity) {
            this.quantity = quantity;
        }

        public String getRemark() {
            return remark;
        }

        public void setRemark(String remark) {
            this.remark = remark;
        }
    }
}