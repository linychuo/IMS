package com.ims.report.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 回款统计DTO
 */
public class CollectionStatisticsDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private LocalDate reportDate;
    private BigDecimal plannedAmount;
    private BigDecimal actualAmount;
    private BigDecimal collectionRate;

    public LocalDate getReportDate() {
        return reportDate;
    }

    public void setReportDate(LocalDate reportDate) {
        this.reportDate = reportDate;
    }

    public BigDecimal getPlannedAmount() {
        return plannedAmount;
    }

    public void setPlannedAmount(BigDecimal plannedAmount) {
        this.plannedAmount = plannedAmount;
    }

    public BigDecimal getActualAmount() {
        return actualAmount;
    }

    public void setActualAmount(BigDecimal actualAmount) {
        this.actualAmount = actualAmount;
    }

    public BigDecimal getCollectionRate() {
        return collectionRate;
    }

    public void setCollectionRate(BigDecimal collectionRate) {
        this.collectionRate = collectionRate;
    }
}