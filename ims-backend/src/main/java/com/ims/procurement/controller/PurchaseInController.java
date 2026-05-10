package com.ims.procurement.controller;

import com.ims.procurement.entity.PurchaseIn;
import com.ims.procurement.service.PurchaseInService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 采购入库控制器
 */
@RestController
@RequestMapping("/api/procurement/purchase-in")
public class PurchaseInController {

    private static final Logger log = LoggerFactory.getLogger(PurchaseInController.class);

    private final PurchaseInService purchaseInService;

    public PurchaseInController(PurchaseInService purchaseInService) {
        this.purchaseInService = purchaseInService;
    }

    @PostMapping
    public ResponseEntity<PurchaseIn> create(@Valid @RequestBody PurchaseIn purchaseIn) {
        return ResponseEntity.ok(purchaseInService.create(purchaseIn));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseIn> update(@PathVariable Long id,
                                              @Valid @RequestBody PurchaseIn purchaseIn) {
        return ResponseEntity.ok(purchaseInService.update(id, purchaseIn));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approve(@PathVariable Long id,
                                         @RequestParam String userId) {
        purchaseInService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id,
                                       @RequestParam String reason) {
        purchaseInService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> complete(@PathVariable Long id) {
        purchaseInService.complete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseIn> getById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseInService.getById(id));
    }

    @GetMapping("/no/{inNo}")
    public ResponseEntity<PurchaseIn> getByInNo(@PathVariable String inNo) {
        return ResponseEntity.ok(purchaseInService.getByInNo(inNo));
    }

    @GetMapping("/list")
    public ResponseEntity<List<PurchaseIn>> list(PurchaseIn query) {
        return ResponseEntity.ok(purchaseInService.list(query));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        purchaseInService.delete(id);
        return ResponseEntity.noContent().build();
    }
}