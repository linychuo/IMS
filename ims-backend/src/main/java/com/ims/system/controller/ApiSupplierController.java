package com.ims.system.controller;

import com.ims.procurement.entity.Supplier;
import com.ims.procurement.service.SupplierService;
import com.ims.system.annotation.Permission;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Supplier> create(@RequestBody Supplier supplier) {
        return ResponseEntity.ok(supplierService.create(supplier));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新供应商")
    public ResponseEntity<Supplier> update(@PathVariable Long id, @RequestBody Supplier supplier) {
        supplier.setId(id);
        return ResponseEntity.ok(supplierService.update(supplier));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看供应商")
    public ResponseEntity<Supplier> getById(@PathVariable Long id) {
        var result = supplierService.getById(id);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @GetMapping("/list")
    @Permission(code = "list", name = "查看供应商列表")
    public ResponseEntity<List<Supplier>> list() {
        return ResponseEntity.ok(supplierService.list(null));
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除供应商")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        supplierService.delete(id);
        return ResponseEntity.ok().build();
    }
}