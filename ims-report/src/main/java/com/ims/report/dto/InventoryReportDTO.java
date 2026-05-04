package com.ims.report.dto;

import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 库存报表DTO
 */
@Data
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
    
    @Data
    public static class InventoryDetailDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private Long inventoryId;
        private String warehouseName;
        private String locationName;
        private Integer quantity;
    }
}