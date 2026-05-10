package com.ims.procurement.dto.request;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 创建采购退货单请求
 */
public class CreatePurchaseReturnRequest {

    private Long purchaseInId;

    @NotNull
    private Long supplierId;

    private LocalDate returnDate;

    @NotNull
    private Long warehouseId;

    private String returnBy;
    private String reason;
    private BigDecimal refundAmount;
    private String remark;

    @NotNull
    private List<PurchaseReturnDetailRequest> details;

    public Long getPurchaseInId() {
        return purchaseInId;
    }

    public void setPurchaseInId(Long purchaseInId) {
        this.purchaseInId = purchaseInId;
    }

    public Long getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(Long supplierId) {
        this.supplierId = supplierId;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public void setReturnDate(LocalDate returnDate) {
        this.returnDate = returnDate;
    }

    public Long getWarehouseId() {
        return warehouseId;
    }

    public void setWarehouseId(Long warehouseId) {
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

    public static class PurchaseReturnDetailRequest {
        @NotNull
        private String productId;
        private String productName;
        private String spec;
        private String unit;
        @NotNull
        private BigDecimal quantity;
        @NotNull
        private BigDecimal price;
        private Long warehouseId;
        private Long locationId;
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

        public Long getWarehouseId() {
            return warehouseId;
        }

        public void setWarehouseId(Long warehouseId) {
            this.warehouseId = warehouseId;
        }

        public Long getLocationId() {
            return locationId;
        }

        public void setLocationId(Long locationId) {
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