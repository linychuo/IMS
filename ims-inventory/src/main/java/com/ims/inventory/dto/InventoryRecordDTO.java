package com.ims.inventory.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 库存变动记录DTO
 */
@Data
public class InventoryRecordDTO {

    private String id;
    
    private String inventoryId;
    
    private String productId;
    
    private String productName;
    
    private String productCode;
    
    private String warehouseId;
    
    private String warehouseName;
    
    private String recordType;
    
    private String refId;
    
    private String refNo;
    
    private BigDecimal beforeQuantity;
    
    private BigDecimal changeQuantity;
    
    private BigDecimal afterQuantity;
    
    private LocalDateTime recordDate;
    
    private String operatorId;
    
    private String remark;
    
    private String createdAt;
}