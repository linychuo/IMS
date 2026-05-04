package com.ims.report.service.impl;

import com.ims.report.dto.*;
import com.ims.report.mapper.ReportMapper;
import com.ims.report.service.IReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
    public DashboardDTO getDashboardData() {
        return reportMapper.getDashboardData();
    }
    
    @Override
    public SalesReportDTO getDailySalesReport() {
        return reportMapper.getTodaySalesData();
    }
    
    @Override
    public List<SalesReportDTO> getSalesSummary(ReportQueryRequest request) {
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();
        return reportMapper.getSalesSummaryList(startDate, endDate);
    }
    
    @Override
    public PurchaseReportDTO getDailyPurchaseReport() {
        return reportMapper.getTodayPurchaseData();
    }
    
    @Override
    public List<PurchaseReportDTO> getPurchaseSummary(ReportQueryRequest request) {
        LocalDate startDate = request.getStartDate();
        LocalDate endDate = request.getEndDate();
        return reportMapper.getPurchaseSummaryList(startDate, endDate);
    }
    
    @Override
    public List<InventoryReportDTO> getInventoryList(ReportQueryRequest request) {
        return reportMapper.getInventoryList(request.getWarehouseId(), request.getProductId());
    }
    
    @Override
    public List<InventoryReportDTO> getLowStockWarning() {
        return reportMapper.getLowStockList();
    }
    
    @Override
    public List<InventoryReportDTO> getIdleStock(Integer days) {
        return reportMapper.getIdleStockList(days != null ? days : 30);
    }
    
    @Override
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
    public FinanceReportDTO getFinanceSummary(ReportQueryRequest request) {
        return reportMapper.getFinanceSummary(request.getStartDate(), request.getEndDate());
    }
}