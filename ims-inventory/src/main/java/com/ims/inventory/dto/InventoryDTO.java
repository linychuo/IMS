package com.ims.inventory.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 库存台账DTO
 */
@Data
public class InventoryDTO {

    private String id;
    
    private String productId;
    
    private String productName;
    
    private String productCode;
    
    private String warehouseId;
    
    private String warehouseName;
    
    private BigDecimal quantity;
    
    private BigDecimal reservedQuantity;
    
    private BigDecimal availableQuantity;
    
    private String batchNo;
    
    private LocalDateTime productionDate;
    
    private LocalDateTime expireDate;
    
    private BigDecimal unitPrice;
    
    private BigDecimal totalAmount;
    
    private String createdAt;
    
    private String updatedAt;
}