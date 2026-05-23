package com.ims.finance.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.finance.dto.CustomerReconciliationDetailDTO;
import com.ims.finance.entity.SupplierReconciliation;
import com.ims.finance.service.SupplierReconciliationService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 供应商对账 Controller
 */
@RestController
@RequestMapping("/api/supplier-reconciliation")
@Permission(code = "finance:supplierReconciliation", name = "供应商对账")
public class SupplierReconciliationController {

    @Autowired
    private SupplierReconciliationService supplierReconciliationService;

    /**
     * 分页查询供应商对账单
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看对账")
    public Result<PageResult<SupplierReconciliation>> page(
            @RequestParam Long page,
            @RequestParam Long pageSize,
            @RequestParam(required = false) Long supplierId,
            @RequestParam(required = false) Integer status) {

        var wrapper = new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<SupplierReconciliation>();
        if (supplierId != null) {
            wrapper.eq(SupplierReconciliation::getSupplierId, supplierId);
        }
        if (status != null) {
            wrapper.eq(SupplierReconciliation::getStatus, status);
        }
        wrapper.eq(SupplierReconciliation::getDeleted, 0)
                .orderByDesc(SupplierReconciliation::getCreateTime);

        long total = supplierReconciliationService.count(wrapper);
        long offset = (page - 1) * pageSize;
        wrapper.last("LIMIT " + offset + ", " + pageSize);

        List<SupplierReconciliation> records = supplierReconciliationService.list(wrapper);
        return Result.success(PageResult.build(records, total, page, pageSize));
    }

    /**
     * 获取对账单详情
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看对账")
    public Result<SupplierReconciliation> getById(@PathVariable Long id) {
        return Result.success(supplierReconciliationService.getById(id));
    }

    /**
     * 生成供应商对账单
     */
    @PostMapping("/generate")
    @Permission(code = "add", name = "生成对账")
    public Result<SupplierReconciliation> generate(
            @RequestParam Long supplierId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return Result.success(supplierReconciliationService.generate(supplierId, startDate, endDate));
    }

    /**
     * 确认对账单
     */
    @PostMapping("/{id}/confirm")
    @Permission(code = "confirm", name = "确认对账")
    public Result<Boolean> confirm(@PathVariable Long id) {
        return Result.success(supplierReconciliationService.confirm(id));
    }

    /**
     * 获取对账明细
     */
    @GetMapping("/detail")
    @Permission(code = "read", name = "查看对账")
    public Result<List<CustomerReconciliationDetailDTO>> getDetail(
            @RequestParam Long supplierId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return Result.success(supplierReconciliationService.getDetail(supplierId, startDate, endDate));
    }

    /**
     * 按供应商查询对账单
     */
    @GetMapping("/supplier/{supplierId}")
    @Permission(code = "read", name = "查看对账")
    public Result<List<SupplierReconciliation>> getBySupplier(@PathVariable Long supplierId) {
        return Result.success(supplierReconciliationService.selectBySupplier(supplierId));
    }
}