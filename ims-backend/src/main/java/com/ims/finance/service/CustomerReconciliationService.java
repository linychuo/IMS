package com.ims.finance.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.finance.dto.CustomerReconciliationDetailDTO;
import com.ims.finance.entity.CustomerReconciliation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 客户对账 Service
 */
public interface CustomerReconciliationService extends IService<CustomerReconciliation> {

    /**
     * 生成客户对账单
     */
    CustomerReconciliation generate(Long customerId, LocalDate startDate, LocalDate endDate);

    /**
     * 确认对账单
     */
    boolean confirm(Long id);

    /**
     * 获取客户对账明细
     */
    List<CustomerReconciliationDetailDTO> getDetail(Long customerId, LocalDate startDate, LocalDate endDate);

    /**
     * 按客户查询对账单
     */
    List<CustomerReconciliation> selectByCustomer(Long customerId);

    /**
     * 获取期末应收（用于期初计算）
     */
    BigDecimal getClosingAmountBefore(Long customerId, LocalDate beforeDate);
}