package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.procurement.entity.Supplier;
import com.ims.procurement.service.SupplierService;
import com.ims.system.annotation.Permission;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 供应商API别名 - 兼容前端调用 /api/supplier/* 路径
 */
@RestController
@RequestMapping("/api/supplier")
@Permission(code = "supplier", name = "供应商管理")
public class ApiSupplierController {

    private final SupplierService supplierService;

    public ApiSupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
    @Permission(code = "create", name = "创建供应商")
    public Result<Supplier> create(@RequestBody Supplier supplier) {
        return Result.success(supplierService.create(supplier));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新供应商")
    public Result<Supplier> update(@PathVariable Long id, @RequestBody Supplier supplier) {
        supplier.setId(id);
        return Result.success(supplierService.update(supplier));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看供应商")
    public Result<Supplier> getById(@PathVariable Long id) {
        return Result.success(supplierService.getById(id));
    }

    @GetMapping("/list")
    @Permission(code = "list", name = "查看供应商列表")
    public Result<List<Supplier>> list() {
        return Result.success(supplierService.list(null));
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除供应商")
    public Result<Void> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return Result.success(null);
    }
}