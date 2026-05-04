package com.ims.report.entity;

import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 报表配置实体
 */
@Data
public class ReportConfig implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Long id;
    private String reportCode;
    private String reportName;
    private String reportType;
    private String dataSource;
    private String sqlTemplate;
    private Integer cacheTimeout;
    private String status;
    private String remark;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}