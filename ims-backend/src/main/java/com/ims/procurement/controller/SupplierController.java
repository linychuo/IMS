package com.ims.procurement.controller;

import com.ims.procurement.entity.Supplier;
import com.ims.procurement.service.SupplierService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 供应商 Controller
 */
@RestController
@RequestMapping("/api/procurement/suppliers")
public class SupplierController {

    private static final Logger log = LoggerFactory.getLogger(SupplierController.class);

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
    public ResponseEntity<Supplier> create(@RequestBody Supplier supplier) {
        log.info("创建供应商: {}", supplier.getSupplierName());
        var result = supplierService.create(supplier);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Supplier> update(@PathVariable Long id, @RequestBody Supplier supplier) {
        supplier.setId(id);
        var result = supplierService.update(supplier);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Supplier> getById(@PathVariable Long id) {
        var result = supplierService.getById(id);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @GetMapping("/code/{supplierCode}")
    public ResponseEntity<Supplier> getByCode(@PathVariable String supplierCode) {
        var result = supplierService.getByCode(supplierCode);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<Supplier>> list(Supplier query) {
        var result = supplierService.list(query);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        log.info("删除供应商, id: {}", id);
        supplierService.delete(id);
        return ResponseEntity.ok().build();
    }
}