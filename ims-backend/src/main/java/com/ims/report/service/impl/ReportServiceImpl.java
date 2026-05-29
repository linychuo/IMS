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
}