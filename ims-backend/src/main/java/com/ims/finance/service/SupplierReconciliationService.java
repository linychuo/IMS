package com.ims.finance.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.finance.dto.CustomerReconciliationDetailDTO;
import com.ims.finance.entity.SupplierReconciliation;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 供应商对账 Service
 */
public interface SupplierReconciliationService extends IService<SupplierReconciliation> {

    /**
     * 生成供应商对账单
     */
    SupplierReconciliation generate(Long supplierId, LocalDate startDate, LocalDate endDate);

    /**
     * 确认对账单
     */
    boolean confirm(Long id);

    /**
     * 获取供应商对账明细
     */
    List<CustomerReconciliationDetailDTO> getDetail(Long supplierId, LocalDate startDate, LocalDate endDate);

    /**
     * 按供应商查询对账单
     */
    List<SupplierReconciliation> selectBySupplier(Long supplierId);

    /**
     * 获取期末应付（用于期初计算）
     */
    BigDecimal getClosingAmountBefore(Long supplierId, LocalDate beforeDate);
}