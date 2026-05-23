package com.ims.procurement.controller;

import com.ims.core.result.Result;
import com.ims.procurement.entity.Supplier;
import com.ims.procurement.service.SupplierService;
import com.ims.system.annotation.Permission;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/procurement/suppliers")
@Permission(code = "supplier", name = "供应商管理")
public class SupplierController {

    private static final Logger log = LoggerFactory.getLogger(SupplierController.class);
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
    @Permission(code = "create", name = "创建供应商")
    public Result<Supplier> create(@RequestBody Supplier supplier) {
        log.info("创建供应商: {}", supplier.getSupplierName());
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
        var result = supplierService.getById(id);
        return result != null ? Result.success(result) : Result.error("供应商不存在");
    }

    @GetMapping("/code/{supplierCode}")
    @Permission(code = "read", name = "查看供应商")
    public Result<Supplier> getByCode(@PathVariable String supplierCode) {
        var result = supplierService.getByCode(supplierCode);
        return result != null ? Result.success(result) : Result.error("供应商不存在");
    }

    @GetMapping
    @Permission(code = "list", name = "查看供应商列表")
    public Result<List<Supplier>> list(Supplier query) {
        return Result.success(supplierService.list(query));
    }

    /**
     * Alternative path for frontend compatibility
     */
    @GetMapping("/list")
    @Permission(code = "list", name = "查看供应商列表")
    public Result<List<Supplier>> listAlias(Supplier query) {
        return Result.success(supplierService.list(query));
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除供应商")
    public Result<Void> delete(@PathVariable Long id) {
        log.info("删除供应商, id: {}", id);
        supplierService.delete(id);
        return Result.success(null);
    }
}