package com.ims.finance.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.finance.entity.Payable;
import com.ims.finance.service.PayableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 应付账款控制器
 */
@RestController
@RequestMapping("/api/finance/payable")
public class PayableController {

    @Autowired
    private PayableService payableService;

    /**
     * 分页查询
     */
    @GetMapping("/page")
    public Result<PageResult<Payable>> page(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) Integer status) {
        return Result.success(payableService.page(page, pageSize, supplierId, status));
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public Result<Payable> getById(@PathVariable Long id) {
        return Result.success(payableService.getById(id));
    }

    /**
     * 创建应付
     */
    @PostMapping
    public Result<Boolean> create(@RequestBody Payable payable) {
        return Result.success(payableService.create(payable));
    }

    /**
     * 更新应付
     */
    @PutMapping
    public Result<Boolean> update(@RequestBody Payable payable) {
        return Result.success(payableService.update(payable));
    }

    /**
     * 付款核销
     */
    @PutMapping("/{id}/writeoff")
    public Result<Boolean> writeoff(@PathVariable Long id,
                                    @RequestParam Long paymentId,
                                    @RequestParam BigDecimal amount) {
        return Result.success(payableService.writeoff(id, paymentId, amount));
    }

    /**
     * 根据供应商查询应付
     */
    @GetMapping("/supplier/{supplierId}")
    public Result<List<Payable>> listBySupplier(@PathVariable Long supplierId) {
        return Result.success(payableService.listBySupplier(supplierId));
    }

    /**
     * 账龄分析
     */
    @GetMapping("/aging")
    public Result<List<Payable>> getAgingAnalysis(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(payableService.getAgingAnalysis(startDate, endDate));
    }

    /**
     * 供应商应付汇总
     */
    @GetMapping("/supplier/{supplierId}/total")
    public Result<BigDecimal> getTotalPending(@PathVariable Long supplierId) {
        return Result.success(payableService.getTotalPendingBySupplier(supplierId));
    }
}