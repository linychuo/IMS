package com.ims.finance.service;

import com.ims.finance.entity.FinanceIn;
import com.ims.finance.entity.FinanceOut;
import com.ims.finance.entity.Account;
import com.ims.finance.entity.AccountTransaction;
import com.ims.finance.dto.*;
import com.ims.core.result.PageResult;

import java.time.LocalDate;
import java.util.List;

/**
 * 财务Service接口
 */
public interface FinanceService {

    // ========== 收款管理 ==========
    PageResult<FinanceIn> pageIn(Long page, Long pageSize, Long customerId, Integer status);

    FinanceIn getInById(Long id);

    boolean saveIn(FinanceIn in);

    boolean auditIn(Long id, Long auditorId);

    boolean cancelIn(Long id);

    boolean deleteIn(Long id);

    int batchAuditIn(List<Long> ids, Long auditorId);

    // ========== 付款管理 ==========
    PageResult<FinanceOut> pageOut(Long page, Long pageSize, Long supplierId, Integer status);

    FinanceOut getOutById(Long id);

    boolean saveOut(FinanceOut out);

    boolean auditOut(Long id, Long auditorId);

    boolean cancelOut(Long id);

    boolean deleteOut(Long id);

    int batchAuditOut(List<Long> ids, Long auditorId);

    // ========== 账户管理 ==========
    PageResult<Account> pageAccount(Long page, Long pageSize, Integer accountType, Integer status);

    Account getAccountById(Long id);

    List<Account> listAccount();

    boolean saveAccount(Account account);

    boolean enableAccount(Long id);

    boolean disableAccount(Long id);

    boolean deleteAccount(Long id);

    // ========== 财务报表 ==========
    FinanceStatDTO getStat();

    FinanceStatDTO getStatByDateRange(LocalDate startDate, LocalDate endDate);

    // ========== 账户交易历史 ==========
    PageResult<AccountTransaction> pageAccountTrans(Long page, Long pageSize, Long accountId);

    List<AccountTransaction> listAccountTrans(Long accountId);

    boolean saveAccountTrans(AccountTransaction trans);

    // ========== 趋势分析 ==========
    FinanceTrendDTO getTrend(Integer months);

    // ========== 汇总数据 ==========
    List<FinanceSummaryDTO> getCustomerSummary();

    List<FinanceSummaryDTO> getSupplierSummary();

    // ========== 导出数据 ==========
    List<FinanceExportDTO> exportIn(LocalDate startDate, LocalDate endDate);

    List<FinanceExportDTO> exportOut(LocalDate startDate, LocalDate endDate);
}
