package com.ims.report.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 库存报表DTO
 */
public class InventoryReportDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long productId;
    private String productName;
    private String productCode;
    private String warehouseName;
    private String locationName;
    private Integer quantity;
    private Integer minQuantity;
    private Integer maxQuantity;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private LocalDateTime lastInTime;
    private LocalDateTime lastOutTime;
    private Integer idleDays;
    private String status;
    private List<InventoryDetailDTO> detailList;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getWarehouseName() {
        return warehouseName;
    }

    public void setWarehouseName(String warehouseName) {
        this.warehouseName = warehouseName;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getMinQuantity() {
        return minQuantity;
    }

    public void setMinQuantity(Integer minQuantity) {
        this.minQuantity = minQuantity;
    }

    public Integer getMaxQuantity() {
        return maxQuantity;
    }

    public void setMaxQuantity(Integer maxQuantity) {
        this.maxQuantity = maxQuantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getLastInTime() {
        return lastInTime;
    }

    public void setLastInTime(LocalDateTime lastInTime) {
        this.lastInTime = lastInTime;
    }

    public LocalDateTime getLastOutTime() {
        return lastOutTime;
    }

    public void setLastOutTime(LocalDateTime lastOutTime) {
        this.lastOutTime = lastOutTime;
    }

    public Integer getIdleDays() {
        return idleDays;
    }

    public void setIdleDays(Integer idleDays) {
        this.idleDays = idleDays;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<InventoryDetailDTO> getDetailList() {
        return detailList;
    }

    public void setDetailList(List<InventoryDetailDTO> detailList) {
        this.detailList = detailList;
    }

    public static class InventoryDetailDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private Long inventoryId;
        private String warehouseName;
        private String locationName;
        private Integer quantity;

        public Long getInventoryId() {
            return inventoryId;
        }

        public void setInventoryId(Long inventoryId) {
            this.inventoryId = inventoryId;
        }

        public String getWarehouseName() {
            return warehouseName;
        }

        public void setWarehouseName(String warehouseName) {
            this.warehouseName = warehouseName;
        }

        public String getLocationName() {
            return locationName;
        }

        public void setLocationName(String locationName) {
            this.locationName = locationName;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }
}