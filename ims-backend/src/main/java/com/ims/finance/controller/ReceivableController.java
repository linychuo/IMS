package com.ims.finance.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.finance.entity.Receivable;
import com.ims.finance.service.ReceivableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 应收账款控制器
 */
@RestController
@RequestMapping("/api/finance/receivable")
public class ReceivableController {

    @Autowired
    private ReceivableService receivableService;

    /**
     * 分页查询
     */
    @GetMapping("/page")
    public Result<PageResult<Receivable>> page(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Integer status) {
        return Result.success(receivableService.page(page, pageSize, customerId, status));
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public Result<Receivable> getById(@PathVariable Long id) {
        return Result.success(receivableService.getById(id));
    }

    /**
     * 创建应收
     */
    @PostMapping
    public Result<Boolean> create(@RequestBody Receivable receivable) {
        return Result.success(receivableService.create(receivable));
    }

    /**
     * 更新应收
     */
    @PutMapping
    public Result<Boolean> update(@RequestBody Receivable receivable) {
        return Result.success(receivableService.update(receivable));
    }

    /**
     * 收款核销
     */
    @PutMapping("/{id}/writeoff")
    public Result<Boolean> writeoff(@PathVariable Long id,
                                    @RequestParam Long receiptId,
                                    @RequestParam BigDecimal amount) {
        return Result.success(receivableService.writeoff(id, receiptId, amount));
    }

    /**
     * 根据客户查询应收
     */
    @GetMapping("/customer/{customerId}")
    public Result<List<Receivable>> listByCustomer(@PathVariable Long customerId) {
        return Result.success(receivableService.listByCustomer(customerId));
    }

    /**
     * 账龄分析
     */
    @GetMapping("/aging")
    public Result<List<Receivable>> getAgingAnalysis(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(receivableService.getAgingAnalysis(startDate, endDate));
    }

    /**
     * 客户应收汇总
     */
    @GetMapping("/customer/{customerId}/total")
    public Result<BigDecimal> getTotalPending(@PathVariable Long customerId) {
        return Result.success(receivableService.getTotalPendingByCustomer(customerId));
    }
}