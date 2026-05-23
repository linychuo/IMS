package com.ims.finance.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.finance.entity.BankReceipt;
import com.ims.finance.entity.Receivable;

import java.math.BigDecimal;
import java.util.List;

/**
 * 银行收款认领 Service
 */
public interface BankReceiptService extends IService<BankReceipt> {

    /**
     * 根据客户查询待认领收款
     */
    List<BankReceipt> selectPendingByCustomer(Long customerId);

    /**
     * 查询所有待认领收款
     */
    List<BankReceipt> selectAllPending();

    /**
     * 创建收款记录
     */
    boolean createReceipt(BankReceipt receipt);

    /**
     * 认领收款（自动匹配应收）
     */
    boolean claimReceipt(Long receiptId, Long receivableId, BigDecimal claimAmount);

    /**
     * 自动认领（根据客户应收自动匹配）
     */
    boolean autoClaim(Long receiptId);

    /**
     * 获取客户待认领总额
     */
    BigDecimal getCustomerPendingAmount(Long customerId);
}