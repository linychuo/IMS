package com.ims.finance.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.finance.entity.BankReceipt;
import com.ims.finance.service.BankReceiptService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 银行收款认领 Controller
 */
@RestController
@RequestMapping("/api/bank-receipt")
@Permission(code = "finance:bankReceipt", name = "收款认领")
public class BankReceiptController {

    @Autowired
    private BankReceiptService bankReceiptService;

    /**
     * 分页查询收款记录
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看收款")
    public Result<PageResult<BankReceipt>> page(
            @RequestParam Long page,
            @RequestParam Long pageSize,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Integer status) {

        var wrapper = new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<BankReceipt>();
        if (customerId != null) {
            wrapper.eq(BankReceipt::getCustomerId, customerId);
        }
        if (status != null) {
            wrapper.eq(BankReceipt::getStatus, status);
        }
        wrapper.eq(BankReceipt::getDeleted, 0);

        long total = bankReceiptService.count(wrapper);
        long offset = (page - 1) * pageSize;
        wrapper.last("LIMIT " + pageSize + " OFFSET " + offset);

        List<BankReceipt> records = bankReceiptService.list(wrapper);
        return Result.success(PageResult.build(records, total, page, pageSize));
    }

    /**
     * 获取收款详情
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看收款")
    public Result<BankReceipt> getById(@PathVariable Long id) {
        return Result.success(bankReceiptService.getById(id));
    }

    /**
     * 创建收款记录
     */
    @PostMapping
    @Permission(code = "add", name = "新增收款")
    public Result<Boolean> create(@RequestBody BankReceipt receipt) {
        return Result.success(bankReceiptService.createReceipt(receipt));
    }

    /**
     * 更新收款记录
     */
    @PutMapping("/{id}")
    @Permission(code = "edit", name = "编辑收款")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody BankReceipt receipt) {
        receipt.setId(id);
        return Result.success(bankReceiptService.updateById(receipt));
    }

    /**
     * 删除收款记录
     */
    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除收款")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(bankReceiptService.removeById(id));
    }

    /**
     * 根据客户查询待认领收款
     */
    @GetMapping("/customer/{customerId}/pending")
    @Permission(code = "read", name = "查看收款")
    public Result<List<BankReceipt>> getPendingByCustomer(@PathVariable Long customerId) {
        return Result.success(bankReceiptService.selectPendingByCustomer(customerId));
    }

    /**
     * 查询所有待认领收款
     */
    @GetMapping("/pending")
    @Permission(code = "read", name = "查看收款")
    public Result<List<BankReceipt>> getAllPending() {
        return Result.success(bankReceiptService.selectAllPending());
    }

    /**
     * 认领收款
     */
    @PostMapping("/{receiptId}/claim/{receivableId}")
    @Permission(code = "claim", name = "认领收款")
    public Result<Boolean> claim(
            @PathVariable Long receiptId,
            @PathVariable Long receivableId,
            @RequestParam BigDecimal amount) {
        return Result.success(bankReceiptService.claimReceipt(receiptId, receivableId, amount));
    }

    /**
     * 自动认领
     */
    @PostMapping("/{receiptId}/auto-claim")
    @Permission(code = "claim", name = "认领收款")
    public Result<Boolean> autoClaim(@PathVariable Long receiptId) {
        return Result.success(bankReceiptService.autoClaim(receiptId));
    }

    /**
     * 获取客户待认领总额
     */
    @GetMapping("/customer/{customerId}/pending-amount")
    @Permission(code = "read", name = "查看收款")
    public Result<BigDecimal> getCustomerPendingAmount(@PathVariable Long customerId) {
        return Result.success(bankReceiptService.getCustomerPendingAmount(customerId));
    }
}