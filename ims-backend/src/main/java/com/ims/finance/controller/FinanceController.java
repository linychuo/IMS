package com.ims.finance.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.finance.dto.FinanceStatDTO;
import com.ims.finance.dto.FinanceTrendDTO;
import com.ims.finance.dto.FinanceSummaryDTO;
import com.ims.finance.dto.FinanceExportDTO;
import com.ims.finance.entity.*;
import com.ims.finance.service.FinanceService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/finance")
@Permission(code = "finance", name = "财务管理")
public class FinanceController {

    @Autowired
    private FinanceService financeService;

    @GetMapping("/in/page")
    @Permission(code = "in:read", name = "查看收款单")
    public Result<PageResult<FinanceIn>> pageIn(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Integer status) {
        return Result.success(financeService.pageIn(page, pageSize, customerId, status));
    }

    @GetMapping("/in/{id}")
    @Permission(code = "in:read", name = "查看收款单")
    public Result<FinanceIn> getIn(@PathVariable Long id) {
        return Result.success(financeService.getInById(id));
    }

    @PostMapping("/in")
    @Permission(code = "in:create", name = "创建收款单")
    public Result<Boolean> saveIn(@RequestBody FinanceIn in) {
        return Result.success(financeService.saveIn(in));
    }

    @PutMapping("/in/audit/{id}")
    @Permission(code = "in:audit", name = "审核收款单")
    public Result<Boolean> auditIn(@PathVariable Long id, @RequestParam Long auditorId) {
        return Result.success(financeService.auditIn(id, auditorId));
    }

    @PutMapping("/in/cancel/{id}")
    @Permission(code = "in:cancel", name = "取消收款单")
    public Result<Boolean> cancelIn(@PathVariable Long id) {
        return Result.success(financeService.cancelIn(id));
    }

    @PutMapping("/in/batch-audit")
    @Permission(code = "in:audit", name = "审核收款单")
    public Result<Integer> batchAuditIn(@RequestBody List<Long> ids, @RequestParam Long auditorId) {
        return Result.success(financeService.batchAuditIn(ids, auditorId));
    }

    @GetMapping("/out/page")
    @Permission(code = "out:read", name = "查看付款单")
    public Result<PageResult<FinanceOut>> pageOut(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) Integer status) {
        return Result.success(financeService.pageOut(page, pageSize, supplierId, status));
    }

    @GetMapping("/out/{id}")
    @Permission(code = "out:read", name = "查看付款单")
    public Result<FinanceOut> getOut(@PathVariable Long id) {
        return Result.success(financeService.getOutById(id));
    }

    @PostMapping("/out")
    @Permission(code = "out:create", name = "创建付款单")
    public Result<Boolean> saveOut(@RequestBody FinanceOut out) {
        return Result.success(financeService.saveOut(out));
    }

    @PutMapping("/out/audit/{id}")
    @Permission(code = "out:audit", name = "审核付款单")
    public Result<Boolean> auditOut(@PathVariable Long id, @RequestParam Long auditorId) {
        return Result.success(financeService.auditOut(id, auditorId));
    }

    @PutMapping("/out/cancel/{id}")
    @Permission(code = "out:cancel", name = "取消付款单")
    public Result<Boolean> cancelOut(@PathVariable Long id) {
        return Result.success(financeService.cancelOut(id));
    }

    @PutMapping("/out/batch-audit")
    @Permission(code = "out:audit", name = "审核付款单")
    public Result<Integer> batchAuditOut(@RequestBody List<Long> ids, @RequestParam Long auditorId) {
        return Result.success(financeService.batchAuditOut(ids, auditorId));
    }

    @GetMapping("/account/page")
    @Permission(code = "account:read", name = "查看账户")
    public Result<PageResult<Account>> pageAccount(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) Integer accountType,
            @RequestParam(required = false) Integer status) {
        return Result.success(financeService.pageAccount(page, pageSize, accountType, status));
    }

    @GetMapping("/account/{id}")
    @Permission(code = "account:read", name = "查看账户")
    public Result<Account> getAccount(@PathVariable Long id) {
        return Result.success(financeService.getAccountById(id));
    }

    @GetMapping("/account/list")
    @Permission(code = "account:list", name = "查看账户")
    public Result<List<Account>> listAccount() {
        return Result.success(financeService.listAccount());
    }

    @PostMapping("/account")
    @Permission(code = "account:create", name = "创建账户")
    public Result<Boolean> saveAccount(@RequestBody Account account) {
        return Result.success(financeService.saveAccount(account));
    }

    @PutMapping("/account/enable/{id}")
    @Permission(code = "account:update", name = "更新账户")
    public Result<Boolean> enableAccount(@PathVariable Long id) {
        return Result.success(financeService.enableAccount(id));
    }

    @PutMapping("/account/disable/{id}")
    @Permission(code = "account:update", name = "更新账户")
    public Result<Boolean> disableAccount(@PathVariable Long id) {
        return Result.success(financeService.disableAccount(id));
    }

    @GetMapping("/stat")
    @Permission(code = "stat:read", name = "查看财务报表")
    public Result<FinanceStatDTO> getStat() {
        return Result.success(financeService.getStat());
    }

    @GetMapping("/account-trans/page")
    @Permission(code = "trans:read", name = "查看交易记录")
    public Result<PageResult<AccountTransaction>> pageAccountTrans(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam Long accountId) {
        return Result.success(financeService.pageAccountTrans(page, pageSize, accountId));
    }

    @GetMapping("/account-trans/list")
    @Permission(code = "trans:list", name = "查看交易记录")
    public Result<List<AccountTransaction>> listAccountTrans(@RequestParam Long accountId) {
        return Result.success(financeService.listAccountTrans(accountId));
    }

    @PostMapping("/account-trans")
    @Permission(code = "trans:create", name = "创建交易记录")
    public Result<Boolean> saveAccountTrans(@RequestBody AccountTransaction trans) {
        return Result.success(financeService.saveAccountTrans(trans));
    }

    @GetMapping("/stat/range")
    @Permission(code = "stat:read", name = "查看财务报表")
    public Result<FinanceStatDTO> getStatByRange(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(financeService.getStatByDateRange(startDate, endDate));
    }

    @GetMapping("/trend")
    @Permission(code = "stat:read", name = "查看财务报表")
    public Result<FinanceTrendDTO> getTrend(@RequestParam(defaultValue = "6") Integer months) {
        return Result.success(financeService.getTrend(months));
    }

    @GetMapping("/summary/customer")
    @Permission(code = "stat:read", name = "查看财务报表")
    public Result<List<FinanceSummaryDTO>> getCustomerSummary() {
        return Result.success(financeService.getCustomerSummary());
    }

    @GetMapping("/summary/supplier")
    @Permission(code = "stat:read", name = "查看财务报表")
    public Result<List<FinanceSummaryDTO>> getSupplierSummary() {
        return Result.success(financeService.getSupplierSummary());
    }

    @GetMapping("/export/in")
    @Permission(code = "stat:read", name = "查看财务报表")
    public Result<List<FinanceExportDTO>> exportIn(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(financeService.exportIn(startDate, endDate));
    }

    @GetMapping("/export/out")
    @Permission(code = "stat:read", name = "查看财务报表")
    public Result<List<FinanceExportDTO>> exportOut(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(financeService.exportOut(startDate, endDate));
    }
}