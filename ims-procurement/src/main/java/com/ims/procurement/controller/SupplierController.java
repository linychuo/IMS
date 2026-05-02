package com.ims.procurement.controller;

import com.ims.procurement.entity.Supplier;
import com.ims.procurement.service.SupplierService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 供应商 Controller
 */
@Slf4j
@RestController
@RequestMapping("/api/procurement/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;

    /**
     * 创建供应商
     */
    @PostMapping
    public ResponseEntity<Supplier> create(@RequestBody Supplier supplier) {
        log.info("创建供应商: {}", supplier.getSupplierName());
        var result = supplierService.create(supplier);
        return ResponseEntity.ok(result);
    }

    /**
     * 更新供应商
     */
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> update(
            @PathVariable String id,
            @RequestBody Supplier supplier) {
        supplier.setId(id);
        var result = supplierService.update(supplier);
        return ResponseEntity.ok(result);
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getById(@PathVariable String id) {
        var result = supplierService.getById(id);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    /**
     * 根据编码查询
     */
    @GetMapping("/code/{supplierCode}")
    public ResponseEntity<Supplier> getByCode(@PathVariable String supplierCode) {
        var result = supplierService.getByCode(supplierCode);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    /**
     * 查询列表
     */
    @GetMapping
    public ResponseEntity<List<Supplier>> list(Supplier query) {
        var result = supplierService.list(query);
        return ResponseEntity.ok(result);
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        log.info("删除供应商, id: {}", id);
        supplierService.delete(id);
        return ResponseEntity.ok().build();
    }
}