package com.ims.inventory.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 出库单DTO
 */
@Data
public class InventoryOutDTO {

    private String id;
    
    private String outNo;
    
    private String outType;
    
    private String refId;
    
    private String refNo;
    
    private String warehouseId;
    
    private String warehouseName;
    
    private String customerId;
    
    private String customerName;
    
    private LocalDateTime outDate;
    
    private String status;
    
    private String approverId;
    
    private LocalDateTime approveTime;
    
    private String outUserId;
    
    private String remark;
    
    private String createdAt;
    
    private String updatedAt;
    
    private List<InventoryOutDetailDTO> details;
}