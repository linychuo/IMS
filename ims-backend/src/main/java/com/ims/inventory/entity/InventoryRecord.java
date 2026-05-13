package com.ims.inventory.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 库存变动记录实体
 */
@TableName("inventory_record")
public class InventoryRecord extends BaseEntity {

    private Long productId;
    private String productName;
    private String productCode;
    private Long warehouseId;
    private String warehouseName;
    private Long locationId;
    private String locationName;
    private String changeType;
    private BigDecimal changeQuantity;
    private BigDecimal beforeQuantity;
    private BigDecimal afterQuantity;
    private String orderType;
    private Long orderId;
    private String orderNo;
    private String batchNo;
    private BigDecimal cost;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public String getWarehouseName() { return warehouseName; }
    public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
    public String getChangeType() { return changeType; }
    public void setChangeType(String changeType) { this.changeType = changeType; }
    public BigDecimal getChangeQuantity() { return changeQuantity; }
    public void setChangeQuantity(BigDecimal changeQuantity) { this.changeQuantity = changeQuantity; }
    public BigDecimal getBeforeQuantity() { return beforeQuantity; }
    public void setBeforeQuantity(BigDecimal beforeQuantity) { this.beforeQuantity = beforeQuantity; }
    public BigDecimal getAfterQuantity() { return afterQuantity; }
    public void setAfterQuantity(BigDecimal afterQuantity) { this.afterQuantity = afterQuantity; }
    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
    public String getBatchNo() { return batchNo; }
    public void setBatchNo(String batchNo) { this.batchNo = batchNo; }
    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }
}