package com.ims.sales.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 销售出库单保存请求
 */
public class SalesOutSaveRequest {

    /**
     * ID (更新时必填)
     */
    private String id;

    /**
     * 关联销售订单ID
     */
    private String orderId;

    /**
     * 客户ID
     */
    @NotBlank(message = "客户ID不能为空")
    private String customerId;

    /**
     * 出库日期
     */
    private LocalDate outDate;

    /**
     * 仓库ID
     */
    @NotBlank(message = "仓库ID不能为空")
    private String warehouseId;

    /**
     * 备注
     */
    private String remark;

    /**
     * 出库明细列表
     */
    @NotEmpty(message = "出库明细不能为空")
    private List<SalesOutDetailRequest> details;

    /**
     * 出库明细
     */
    public static class SalesOutDetailRequest {
        /**
         * 明细ID (更新时必填)
         */
        private String id;

        /**
         * 订单明细ID
         */
        @NotBlank(message = "订单明细ID不能为空")
        private String orderDetailId;

        /**
         * 商品ID
         */
        @NotBlank(message = "商品ID不能为空")
        private String productId;

        /**
         * 出库数量
         */
        @NotBlank(message = "出库数量不能为空")
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
        public String getOrderDetailId() { return orderDetailId; }
        public void setOrderDetailId(String orderDetailId) { this.orderDetailId = orderDetailId; }
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
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public LocalDate getOutDate() { return outDate; }
    public void setOutDate(LocalDate outDate) { this.outDate = outDate; }
    public String getWarehouseId() { return warehouseId; }
    public void setWarehouseId(String warehouseId) { this.warehouseId = warehouseId; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public List<SalesOutDetailRequest> getDetails() { return details; }
    public void setDetails(List<SalesOutDetailRequest> details) { this.details = details; }
}