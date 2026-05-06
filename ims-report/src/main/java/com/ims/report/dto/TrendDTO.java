package com.ims.report.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 趋势数据DTO
 */
public class TrendDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String trendType;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<TrendPointDTO> dataList;

    public String getTrendType() {
        return trendType;
    }

    public void setTrendType(String trendType) {
        this.trendType = trendType;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public List<TrendPointDTO> getDataList() {
        return dataList;
    }

    public void setDataList(List<TrendPointDTO> dataList) {
        this.dataList = dataList;
    }

    public static class TrendPointDTO implements Serializable {
        private static final long serialVersionUID = 1L;
        private String date;
        private BigDecimal amount;
        private Integer count;

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public Integer getCount() {
            return count;
        }

        public void setCount(Integer count) {
            this.count = count;
        }
    }
}