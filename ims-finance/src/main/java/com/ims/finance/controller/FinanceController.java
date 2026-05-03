package com.ims.finance.controller;

import com.ims.core.dto.PageResult;
import com.ims.core.dto.Result;
import com.ims.finance.dto.FinanceStatDTO;
import com.ims.finance.entity.*;
import com.ims.finance.service.FinanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {
    
    @Autowired
    private FinanceService financeService;

    // ========== 收款管理 ==========
    @GetMapping("/in/page")
    public Result<PageResult<FinanceIn>> pageIn(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Integer status) {
        return Result.success(financeService.pageIn(page, pageSize, customerId, status));
    }

    @GetMapping("/in/{id}")
    public Result<FinanceIn> getIn(@PathVariable Long id) {
        return Result.success(financeService.getInById(id));
    }

    @PostMapping("/in")
    public Result<Void> saveIn(@RequestBody FinanceIn in) {
        return Result.success(financeService.saveIn(in));
    }

    @PutMapping("/in/audit/{id}")
    public Result<Void> auditIn(@PathVariable Long id, @RequestParam Long auditorId) {
        return Result.success(financeService.auditIn(id, auditorId));
    }

    @PutMapping("/in/cancel/{id}")
    public Result<Void> cancelIn(@PathVariable Long id) {
        return Result.success(financeService.cancelIn(id));
    }

    @DeleteMapping("/in/{id}")
    public Result<Void> deleteIn(@PathVariable Long id) {
        return Result.success(financeService.deleteIn(id));
    }

    @PutMapping("/in/batch-audit")
    public Result<Integer> batchAuditIn(@RequestBody List<Long> ids, @RequestParam Long auditorId) {
        return Result.success(financeService.batchAuditIn(ids, auditorId));
    }

    // ========== 付款管理 ==========
    @GetMapping("/out/page")
    public Result<PageResult<FinanceOut>> pageOut(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) Integer status) {
        return Result.success(financeService.pageOut(page, pageSize, supplierId, status));
    }

    @GetMapping("/out/{id}")
    public Result<FinanceOut> getOut(@PathVariable Long id) {
        return Result.success(financeService.getOutById(id));
    }

    @PostMapping("/out")
    public Result<Void> saveOut(@RequestBody FinanceOut out) {
        return Result.success(financeService.saveOut(out));
    }

    @PutMapping("/out/audit/{id}")
    public Result<Void> auditOut(@PathVariable Long id, @RequestParam Long auditorId) {
        return Result.success(financeService.auditOut(id, auditorId));
    }

    @PutMapping("/out/cancel/{id}")
    public Result<Void> cancelOut(@PathVariable Long id) {
        return Result.success(financeService.cancelOut(id));
    }

    @DeleteMapping("/out/{id}")
    public Result<Void> deleteOut(@PathVariable Long id) {
        return Result.success(financeService.deleteOut(id));
    }

    @PutMapping("/out/batch-audit")
    public Result<Integer> batchAuditOut(@RequestBody List<Long> ids, @RequestParam Long auditorId) {
        return Result.success(financeService.batchAuditOut(ids, auditorId));
    }

    // ========== 账户管理 ==========
    @GetMapping("/account/page")
    public Result<PageResult<Account>> pageAccount(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) Integer accountType,
            @RequestParam(required = false) Integer status) {
        return Result.success(financeService.pageAccount(page, pageSize, accountType, status));
    }

    @GetMapping("/account/{id}")
    public Result<Account> getAccount(@PathVariable Long id) {
        return Result.success(financeService.getAccountById(id));
    }

    @GetMapping("/account/list")
    public Result<List<Account>> listAccount() {
        return Result.success(financeService.listAccount());
    }

    @PostMapping("/account")
    public Result<Void> saveAccount(@RequestBody Account account) {
        return Result.success(financeService.saveAccount(account));
    }

    @PutMapping("/account/enable/{id}")
    public Result<Void> enableAccount(@PathVariable Long id) {
        return Result.success(financeService.enableAccount(id));
    }

    @PutMapping("/account/disable/{id}")
    public Result<Void> disableAccount(@PathVariable Long id) {
        return Result.success(financeService.disableAccount(id));
    }

    @DeleteMapping("/account/{id}")
    public Result<Void> deleteAccount(@PathVariable Long id) {
        return Result.success(financeService.deleteAccount(id));
    }

    // ========== 财务报表 ==========
    @GetMapping("/stat")
    public Result<FinanceStatDTO> getStat() {
        return Result.success(financeService.getStat());
    }

    // ========== 账户交易历史 ==========
    @GetMapping("/account-trans/page")
    public Result<PageResult<AccountTransaction>> pageAccountTrans(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam Long accountId) {
        return Result.success(financeService.pageAccountTrans(page, pageSize, accountId));
    }

    @GetMapping("/account-trans/list")
    public Result<List<AccountTransaction>> listAccountTrans(@RequestParam Long accountId) {
        return Result.success(financeService.listAccountTrans(accountId));
    }

    @PostMapping("/account-trans")
    public Result<Void> saveAccountTrans(@RequestBody AccountTransaction trans) {
        return Result.success(financeService.saveAccountTrans(trans));
    }
}