package com.ims.inventory.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 入库单明细DTO
 */
@Data
public class InventoryInDetailDTO {

    private String id;
    
    private String inId;
    
    private String productId;
    
    private String productName;
    
    private String productCode;
    
    private String inventoryId;
    
    private BigDecimal quantity;
    
    private String unit;
    
    private BigDecimal unitPrice;
    
    private BigDecimal amount;
    
    private String batchNo;
    
    private String productionDate;
    
    private String expireDate;
    
    private String remark;
}