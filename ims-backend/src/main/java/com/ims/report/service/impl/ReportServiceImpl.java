package com.ims.report.service.impl;

import com.ims.report.dto.*;
import com.ims.report.mapper.ReportMapper;
import com.ims.report.service.IReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * 报表服务实现
 */
@Service
public class ReportServiceImpl implements IReportService {

    @Autowired
    private ReportMapper reportMapper;

    @Override
    @Transactional(readOnly = true)
    public DashboardDTO getDashboardData() {
        return reportMapper.getDashboardData();
    }
    
    @Override
    @Transactional(readOnly = true)
    public SalesReportDTO getDailySalesReport() {
        return reportMapper.getTodaySalesData();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SalesReportDTO> getSalesSummary(ReportQueryRequest request) {
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();
        return reportMapper.getSalesSummaryList(startDate, endDate);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PurchaseReportDTO getDailyPurchaseReport() {
        return reportMapper.getTodayPurchaseData();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PurchaseReportDTO> getPurchaseSummary(ReportQueryRequest request) {
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();
        return reportMapper.getPurchaseSummaryList(startDate, endDate);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryReportDTO> getInventoryList(ReportQueryRequest request) {
        return reportMapper.getInventoryList(request.getWarehouseId(), request.getProductId());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryReportDTO> getLowStockWarning() {
        return reportMapper.getLowStockList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<InventoryReportDTO> getIdleStock(Integer days) {
        return reportMapper.getIdleStockList(days != null ? days : 30);
    }
    
    @Override
    @Transactional(readOnly = true)
    public TrendDTO getSalesTrend(ReportQueryRequest request) {
        TrendDTO trendDTO = new TrendDTO();
        trendDTO.setTrendType("sales");
        trendDTO.setStartDate(request.getStartDate());
        trendDTO.setEndDate(request.getEndDate());
        List<TrendDTO.TrendPointDTO> dataList = reportMapper.getSalesTrendList(
            request.getStartDate(), request.getEndDate());
        trendDTO.setDataList(dataList);
        return trendDTO;
    }
    
    @Override
    @Transactional(readOnly = true)
    public TrendDTO getPurchaseTrend(ReportQueryRequest request) {
        TrendDTO trendDTO = new TrendDTO();
        trendDTO.setTrendType("purchase");
        trendDTO.setStartDate(request.getStartDate());
        trendDTO.setEndDate(request.getEndDate());
        List<TrendDTO.TrendPointDTO> dataList = reportMapper.getPurchaseTrendList(
            request.getStartDate(), request.getEndDate());
        trendDTO.setDataList(dataList);
        return trendDTO;
    }
    
    @Override
    @Transactional(readOnly = true)
    public FinanceReportDTO getFinanceSummary(ReportQueryRequest request) {
        return reportMapper.getFinanceSummary(request.getStartDate(), request.getEndDate());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerAnalysisDTO> getCustomerAnalysis(LocalDate startDate, LocalDate endDate) {
        return reportMapper.getCustomerAnalysisList(startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerAnalysisDTO getCustomerAnalysisById(Long customerId) {
        return reportMapper.getCustomerAnalysisById(customerId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductAnalysisDTO> getProductAnalysis(LocalDate startDate, LocalDate endDate) {
        return reportMapper.getProductAnalysisList(startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupplierAnalysisDTO> getSupplierAnalysis(LocalDate startDate, LocalDate endDate) {
        return reportMapper.getSupplierAnalysisList(startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public SupplierAnalysisDTO getSupplierAnalysisById(Long supplierId) {
        return reportMapper.getSupplierAnalysisById(supplierId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryTurnoverDTO> getInventoryTurnover(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        return reportMapper.getInventoryTurnoverList(startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProfitMarginDTO> getProfitMargin(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        return reportMapper.getProfitMarginList(startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CollectionStatisticsDTO> getCollectionStatistics(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        return reportMapper.getCollectionStatisticsList(startDate, endDate);
    }

    @Override
    @Transactional(readOnly = true)
    public AgingAnalysisDTO getReceivableAging() {
        AgingAnalysisDTO dto = new AgingAnalysisDTO();
        dto.setSummaryType("RECEIVABLE");
        List<AgingAnalysisDTO.AgingItem> items = reportMapper.getReceivableAgingList();
        dto.setItems(items);
        buildAgingBuckets(dto, items);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public AgingAnalysisDTO getPayableAging() {
        AgingAnalysisDTO dto = new AgingAnalysisDTO();
        dto.setSummaryType("PAYABLE");
        List<AgingAnalysisDTO.AgingItem> items = reportMapper.getPayableAgingList();
        dto.setItems(items);
        buildAgingBuckets(dto, items);
        return dto;
    }

    private void buildAgingBuckets(AgingAnalysisDTO dto, List<AgingAnalysisDTO.AgingItem> items) {
        if (items == null || items.isEmpty()) {
            dto.setTotalAmount(java.math.BigDecimal.ZERO);
            dto.setTotalPending(java.math.BigDecimal.ZERO);
            dto.setOrderCount(0);
            dto.setOverdueCount(0);
            dto.setBuckets(java.util.Collections.emptyList());
            return;
        }

        java.math.BigDecimal totalAmount = java.math.BigDecimal.ZERO;
        java.math.BigDecimal totalPending = java.math.BigDecimal.ZERO;
        long overdueCount = 0;
        long[] bucketCounts = new long[4];
        java.math.BigDecimal[] bucketAmounts = new java.math.BigDecimal[4];
        for (int i = 0; i < 4; i++) bucketAmounts[i] = java.math.BigDecimal.ZERO;

        for (AgingAnalysisDTO.AgingItem item : items) {
            if (item.getTotalAmount() != null) totalAmount = totalAmount.add(item.getTotalAmount());
            if (item.getPendingAmount() != null) totalPending = totalPending.add(item.getPendingAmount());
            if (item.getOverdueDays() > 0) overdueCount++;

            int bucketIdx;
            if (item.getOverdueDays() <= 0) {
                bucketIdx = 0; // 正常未逾期
            } else if (item.getOverdueDays() <= 30) {
                bucketIdx = 0;
            } else if (item.getOverdueDays() <= 60) {
                bucketIdx = 1;
            } else if (item.getOverdueDays() <= 90) {
                bucketIdx = 2;
            } else {
                bucketIdx = 3;
            }
            bucketCounts[bucketIdx]++;
            if (item.getPendingAmount() != null) {
                bucketAmounts[bucketIdx] = bucketAmounts[bucketIdx].add(item.getPendingAmount());
            }
        }

        dto.setTotalAmount(totalAmount);
        dto.setTotalPending(totalPending);
        dto.setOrderCount(items.size());
        dto.setOverdueCount(overdueCount);

        java.util.List<AgingAnalysisDTO.AgingBucket> buckets = new java.util.ArrayList<>();
        String[] bucketNames = {"0-30天", "31-60天", "61-90天", "90天以上"};
        int[] minDays = {0, 31, 61, 91};
        int[] maxDays = {30, 60, 90, Integer.MAX_VALUE};

        for (int i = 0; i < 4; i++) {
            AgingAnalysisDTO.AgingBucket bucket = new AgingAnalysisDTO.AgingBucket();
            bucket.setBucketName(bucketNames[i]);
            bucket.setMinDays(minDays[i]);
            bucket.setMaxDays(maxDays[i]);
            bucket.setCount(bucketCounts[i]);
            bucket.setAmount(bucketAmounts[i]);
            if (totalPending.compareTo(java.math.BigDecimal.ZERO) > 0) {
                bucket.setPercentage(bucketAmounts[i].divide(totalPending, 4, java.math.RoundingMode.HALF_UP));
            } else {
                bucket.setPercentage(java.math.BigDecimal.ZERO);
            }
            buckets.add(bucket);
        }
        dto.setBuckets(buckets);
    }
}