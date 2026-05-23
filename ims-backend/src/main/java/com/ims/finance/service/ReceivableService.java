package com.ims.finance.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.finance.dto.CustomerStatementDTO;
import com.ims.finance.entity.Receivable;
import com.ims.core.result.PageResult;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 应收账款 Service 接口
 */
public interface ReceivableService extends IService<Receivable> {

    /**
     * 分页查询
     */
    PageResult<Receivable> page(Long page, Long pageSize, Long customerId, Integer status);

    /**
     * 根据ID查询
     */
    Receivable getById(Long id);

    /**
     * 创建应收
     */
    boolean create(Receivable receivable);

    /**
     * 更新应收
     */
    boolean update(Receivable receivable);

    /**
     * 收款核销
     */
    boolean writeoff(Long id, Long receiptId, BigDecimal amount);

    /**
     * 自动收款核销（按FIFO先进先出原则，自动选择最早应收进行核销）
     * @param customerId 客户ID
     * @param receiptId 收款记录ID
     * @param totalReceiptAmount 收款总金额
     * @return 实际核销金额
     */
    BigDecimal autoWriteoff(Long customerId, Long receiptId, BigDecimal totalReceiptAmount);

    /**
     * 根据客户查询
     */
    List<Receivable> listByCustomer(Long customerId);

    /**
     * 账龄分析
     */
    List<Receivable> getAgingAnalysis(LocalDate startDate, LocalDate endDate);

    /**
     * 汇总客户应收
     */
    BigDecimal getTotalPendingByCustomer(Long customerId);

    /**
     * 获取客户对账单
     */
    CustomerStatementDTO getCustomerStatement(Long customerId, LocalDate startDate, LocalDate endDate);

    /**
     * 获取逾期应收列表（用于预警提醒）
     */
    List<Receivable> getOverdueReceivables(Integer overdueDays);

    /**
     * 获取即将到期应收（N天内）
     */
    List<Receivable> getDueSoonReceivables(Integer days);
}