package com.ims.procurement.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 更新采购退货单请求
 */
public class UpdatePurchaseReturnRequest {

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
    private List<CreatePurchaseReturnRequest.PurchaseReturnDetailRequest> details;

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

    public List<CreatePurchaseReturnRequest.PurchaseReturnDetailRequest> getDetails() {
        return details;
    }

    public void setDetails(List<CreatePurchaseReturnRequest.PurchaseReturnDetailRequest> details) {
        this.details = details;
    }
}
