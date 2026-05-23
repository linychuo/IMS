package com.ims.finance.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.finance.dto.SupplierStatementDTO;
import com.ims.finance.entity.Payable;
import com.ims.core.result.PageResult;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 应付账款 Service 接口
 */
public interface PayableService extends IService<Payable> {

    /**
     * 分页查询
     */
    PageResult<Payable> page(Long page, Long pageSize, Long supplierId, Integer status);

    /**
     * 根据ID查询
     */
    Payable getById(Long id);

    /**
     * 创建应付
     */
    boolean create(Payable payable);

    /**
     * 更新应付
     */
    boolean update(Payable payable);

    /**
     * 付款核销
     */
    boolean writeoff(Long id, Long paymentId, BigDecimal amount);

    /**
     * 自动付款核销（按FIFO先进先出原则，自动选择最早应付进行核销）
     * @param supplierId 供应商ID
     * @param paymentId 付款记录ID
     * @param totalPaymentAmount 付款总金额
     * @return 实际核销金额
     */
    BigDecimal autoWriteoff(Long supplierId, Long paymentId, BigDecimal totalPaymentAmount);

    /**
     * 根据供应商查询
     */
    List<Payable> listBySupplier(Long supplierId);

    /**
     * 账龄分析
     */
    List<Payable> getAgingAnalysis(LocalDate startDate, LocalDate endDate);

    /**
     * 汇总供应商应付
     */
    BigDecimal getTotalPendingBySupplier(Long supplierId);

    /**
     * 获取供应商对账单
     */
    SupplierStatementDTO getSupplierStatement(Long supplierId, LocalDate startDate, LocalDate endDate);
}