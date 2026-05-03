package com.ims.inventory.dto;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 出库单明细DTO
 */
@Data
public class InventoryOutDetailDTO {

    private String id;
    
    private String outId;
    
    private String productId;
    
    private String productName;
    
    private String productCode;
    
    private String inventoryId;
    
    private BigDecimal quantity;
    
    private String unit;
    
    private BigDecimal unitPrice;
    
    private BigDecimal amount;
    
    private String remark;
}