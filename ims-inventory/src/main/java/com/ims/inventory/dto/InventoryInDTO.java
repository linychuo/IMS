package com.ims.inventory.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 入库单DTO
 */
@Data
public class InventoryInDTO {

    private String id;
    
    private String inNo;
    
    private String inType;
    
    private String refId;
    
    private String refNo;
    
    private String warehouseId;
    
    private String warehouseName;
    
    private String supplierId;
    
    private String supplierName;
    
    private LocalDateTime inDate;
    
    private String status;
    
    private String approverId;
    
    private LocalDateTime approveTime;
    
    private String inUserId;
    
    private String remark;
    
    private String createdAt;
    
    private String updatedAt;
    
    private List<InventoryInDetailDTO> details;
}