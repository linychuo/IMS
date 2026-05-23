package com.ims.finance.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.finance.entity.Payable;
import com.ims.finance.service.PayableService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/finance/payable")
@Permission(code = "finance:payable", name = "应付账款")
public class PayableController {

    @Autowired
    private PayableService payableService;

    @GetMapping("/page")
    @Permission(code = "read", name = "查看应付账款")
    public Result<PageResult<Payable>> page(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) Integer status) {
        return Result.success(payableService.page(page, pageSize, supplierId, status));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看应付账款")
    public Result<Payable> getById(@PathVariable Long id) {
        return Result.success(payableService.getById(id));
    }

    @PostMapping
    @Permission(code = "create", name = "创建应付账款")
    public Result<Boolean> create(@RequestBody Payable payable) {
        return Result.success(payableService.create(payable));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新应付账款")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody Payable payable) {
        payable.setId(id);
        return Result.success(payableService.update(payable));
    }

    @PutMapping("/{id}/writeoff")
    @Permission(code = "writeoff", name = "付款核销")
    public Result<Boolean> writeoff(@PathVariable Long id,
                                    @RequestParam Long paymentId,
                                    @RequestParam BigDecimal amount) {
        return Result.success(payableService.writeoff(id, paymentId, amount));
    }

    @GetMapping("/supplier/{supplierId}")
    @Permission(code = "read", name = "查看应付账款")
    public Result<List<Payable>> listBySupplier(@PathVariable Long supplierId) {
        return Result.success(payableService.listBySupplier(supplierId));
    }

    @GetMapping("/aging")
    @Permission(code = "read", name = "查看应付账款")
    public Result<List<Payable>> getAgingAnalysis(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return Result.success(payableService.getAgingAnalysis(startDate, endDate));
    }

    @GetMapping("/supplier/{supplierId}/total")
    @Permission(code = "read", name = "查看应付账款")
    public Result<BigDecimal> getTotalPending(@PathVariable Long supplierId) {
        return Result.success(payableService.getTotalPendingBySupplier(supplierId));
    }
}