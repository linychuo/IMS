package com.ims.report.dto;

import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 趋势数据DTO
 */
@Data
public class TrendDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String trendType;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<TrendPointDTO> dataList;
    
    @Data
    public static class TrendPointDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private String date;
        private BigDecimal amount;
        private Integer count;
    }
}