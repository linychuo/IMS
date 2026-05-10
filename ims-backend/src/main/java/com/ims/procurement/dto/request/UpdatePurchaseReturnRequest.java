package com.ims.procurement.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 更新采购退货单请求
 */
public class UpdatePurchaseReturnRequest {

    private Long purchaseInId;
    private Long supplierId;
    private LocalDate returnDate;
    private Long warehouseId;
    private String returnBy;
    private String reason;
    private BigDecimal refundAmount;
    private String remark;
    private List<CreatePurchaseReturnRequest.PurchaseReturnDetailRequest> details;

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

    public List<CreatePurchaseReturnRequest.PurchaseReturnDetailRequest> getDetails() {
        return details;
    }

    public void setDetails(List<CreatePurchaseReturnRequest.PurchaseReturnDetailRequest> details) {
        this.details = details;
    }
}