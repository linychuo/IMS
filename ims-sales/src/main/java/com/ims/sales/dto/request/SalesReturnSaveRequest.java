package com.ims.sales.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 销售退货单保存请求
 */
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

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getOutDetailId() { return outDetailId; }
        public void setOutDetailId(String outDetailId) { this.outDetailId = outDetailId; }
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }
        public BigDecimal getQuantity() { return quantity; }
        public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }
        public String getRemark() { return remark; }
        public void setRemark(String remark) { this.remark = remark; }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }
    public String getOutId() { return outId; }
    public void setOutId(String outId) { this.outId = outId; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }
    public String getWarehouseId() { return warehouseId; }
    public void setWarehouseId(String warehouseId) { this.warehouseId = warehouseId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public List<SalesReturnDetailRequest> getDetails() { return details; }
    public void setDetails(List<SalesReturnDetailRequest> details) { this.details = details; }
}