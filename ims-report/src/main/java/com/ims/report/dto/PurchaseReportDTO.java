package com.ims.report.dto;

import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 采购报表DTO
 */
@Data
public class PurchaseReportDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long id;
    private LocalDate reportDate;
    private String reportType;
    private BigDecimal totalPurchaseAmount;
    private Integer totalOrderCount;
    private BigDecimal avgOrderAmount;
    private Integer productCount;
    private BigDecimal returnAmount;
    private BigDecimal netAmount;
    private List<PurchaseDetailDTO> detailList;
    
    @Data
    public static class PurchaseDetailDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private Long orderId;
        private String orderNo;
        private String supplierName;
        private BigDecimal amount;
        private String status;
    }
}