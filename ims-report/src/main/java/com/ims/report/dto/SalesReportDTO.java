package com.ims.report.dto;

import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 销售报表DTO
 */
@Data
public class SalesReportDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long id;
    private LocalDate reportDate;
    private String reportType;
    private BigDecimal totalSalesAmount;
    private Integer totalOrderCount;
    private BigDecimal avgOrderAmount;
    private Integer productCount;
    private BigDecimal discountAmount;
    private BigDecimal returnAmount;
    private BigDecimal netAmount;
    private List<SalesDetailDTO> detailList;
    
    @Data
    public static class SalesDetailDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private Long orderId;
        private String orderNo;
        private String customerName;
        private BigDecimal amount;
        private String status;
    }
}