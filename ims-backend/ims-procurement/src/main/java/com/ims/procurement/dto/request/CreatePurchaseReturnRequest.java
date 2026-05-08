package com.ims.procurement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 创建采购退货单请求
 */
public class CreatePurchaseReturnRequest {

    /**
     * 关联采购入库单ID
     */
    private String purchaseInId;

    /**
     * 供应商ID
     */
    @NotBlank
    private String supplierId;

    /**
     * 退货日期
     */
    private LocalDate returnDate;

    /**
     * 仓库ID
     */
    @NotBlank
    private String warehouseId;

    /**
     * 退货人ID
     */
    private String returnBy;

    /**
     * 退货原因
     */
    private String reason;

    /**
     * 退款金额
     */
    private BigDecimal refundAmount;

    /**
     * 备注
     */
    private String remark;

    /**
     * 明细列表
     */
    @NotNull
    private List<PurchaseReturnDetailRequest> details;

    public String getPurchaseInId() {
        return purchaseInId;
    }

    public void setPurchaseInId(String purchaseInId) {
        this.purchaseInId = purchaseInId;
    }

    public String getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(String supplierId) {
        this.supplierId = supplierId;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public String getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(String warehouseId) {
        this.warehouseId = warehouseId;
    }

    public String getReturnBy() {
        return returnBy;
    }

    public void setReturnBy(String returnBy) {
        this.returnBy = returnBy;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public List<PurchaseReturnDetailRequest> getDetails() {
        return details;
    }

    public void setDetails(List<PurchaseReturnDetailRequest> details) {
        this.details = details;
    }

    /**
     * 退货明细请求
     */
    public static class PurchaseReturnDetailRequest {
        @NotBlank
        private String productId;
        private String productName;
        private String spec;
        private String unit;
        @NotNull
        private BigDecimal quantity;
        @NotNull
        private BigDecimal price;
        private String warehouseId;
        private String locationId;
        private String batchNo;

        public String getProductId() {
            return productId;
        }

        public void setProductId(String productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public String getSpec() {
            return spec;
        }

        public void setSpec(String spec) {
            this.spec = spec;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }

        public BigDecimal getQuantity() {
            return quantity;
        }

        public void setQuantity(BigDecimal quantity) {
            this.quantity = quantity;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public void setPrice(BigDecimal price) {
            this.price = price;
        }

        public String getWarehouseId() {
            return warehouseId;
        }

        public void setWarehouseId(String warehouseId) {
            this.warehouseId = warehouseId;
        }

        public String getLocationId() {
            return locationId;
        }

        public void setLocationId(String locationId) {
            this.locationId = locationId;
        }

        public String getBatchNo() {
            return batchNo;
        }

        public void setBatchNo(String batchNo) {
            this.batchNo = batchNo;
        }
    }
}
