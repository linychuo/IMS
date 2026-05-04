package com.ims.report.dto;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * 报表查询请求DTO
 */
@Data
public class ReportQueryRequest implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private LocalDate startDate;
    private LocalDate endDate;
    private Long warehouseId;
    private Long productId;
    private Long supplierId;
    private Long customerId;
    private String reportType;
    private Integer pageNum;
    private Integer pageSize;
}