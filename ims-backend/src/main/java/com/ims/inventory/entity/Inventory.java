package com.ims.inventory.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 库存台账实体
 */
@TableName("inventory")
public class Inventory extends BaseEntity {

    private Long productId;
    private Long warehouseId;
    private Long locationId;
    private BigDecimal quantity;
    private BigDecimal frozenQuantity;
    private BigDecimal cost;
    private String batchNo;
    private LocalDate productionDate;
    private LocalDate expiryDate;
    private String productName;
    private String productCode;
    private String warehouseName;
    private String locationName;
    private BigDecimal highStockWarning;

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public Long getLocationId() { return locationId; }
    public void setLocationId(Long locationId) { this.locationId = locationId; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public BigDecimal getFrozenQuantity() { return frozenQuantity; }
    public void setFrozenQuantity(BigDecimal frozenQuantity) { this.frozenQuantity = frozenQuantity; }
    public BigDecimal getCost() { return cost; }
    public void setCost(BigDecimal cost) { this.cost = cost; }
    public String getBatchNo() { return batchNo; }
    public void setBatchNo(String batchNo) { this.batchNo = batchNo; }
    public LocalDate getProductionDate() { return productionDate; }
    public void setProductionDate(LocalDate productionDate) { this.productionDate = productionDate; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public String getWarehouseName() { return warehouseName; }
    public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
    public BigDecimal getHighStockWarning() { return highStockWarning; }
    public void setHighStockWarning(BigDecimal highStockWarning) { this.highStockWarning = highStockWarning; }
}
