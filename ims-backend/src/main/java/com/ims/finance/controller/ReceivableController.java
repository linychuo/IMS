package com.ims.finance.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.finance.entity.Receivable;
import com.ims.finance.service.ReceivableService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/finance/receivable")
@Permission(code = "finance:receivable", name = "应收账款")
public class ReceivableController {

    @Autowired
    private ReceivableService receivableService;

    @GetMapping("/page")
    @Permission(code = "read", name = "查看应收账款")
    public Result<PageResult<Receivable>> page(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Integer status) {
        return Result.success(receivableService.page(page, pageSize, customerId, status));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看应收账款")
    public Result<Receivable> getById(@PathVariable Long id) {
        return Result.success(receivableService.getById(id));
    }

    @PostMapping
    @Permission(code = "create", name = "创建应收账款")
    public Result<Boolean> create(@RequestBody Receivable receivable) {
        return Result.success(receivableService.create(receivable));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新应收账款")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody Receivable receivable) {
        receivable.setId(id);
        return Result.success(receivableService.update(receivable));
    }

    @PutMapping("/{id}/writeoff")
    @Permission(code = "writeoff", name = "收款核销")
    public Result<Boolean> writeoff(@PathVariable Long id,
                                    @RequestParam Long receiptId,
                                    @RequestParam BigDecimal amount) {
        return Result.success(receivableService.writeoff(id, receiptId, amount));
    }

    @GetMapping("/customer/{customerId}")
    @Permission(code = "read", name = "查看应收账款")
    public Result<List<Receivable>> listByCustomer(@PathVariable Long customerId) {
        return Result.success(receivableService.listByCustomer(customerId));
    }

    @GetMapping("/aging")
    @Permission(code = "read", name = "查看应收账款")
    public Result<List<Receivable>> getAgingAnalysis(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(receivableService.getAgingAnalysis(startDate, endDate));
    }

    @GetMapping("/customer/{customerId}/total")
    @Permission(code = "read", name = "查看应收账款")
    public Result<BigDecimal> getTotalPending(@PathVariable Long customerId) {
        return Result.success(receivableService.getTotalPendingByCustomer(customerId));
    }
}