package com.ims.system.controller;

import com.ims.procurement.entity.PurchaseIn;
import com.ims.procurement.service.PurchaseInService;
import com.ims.system.annotation.Permission;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 采购入库API别名 - 兼容前端调用 /api/purchase-in/* 路径
 */
@RestController
@RequestMapping("/api/purchase-in")
@Permission(code = "purchase:in", name = "采购入库")
public class ApiPurchaseInController {

    private final PurchaseInService purchaseInService;

    public ApiPurchaseInController(PurchaseInService purchaseInService) {
        this.purchaseInService = purchaseInService;
    }

    @PostMapping
    @Permission(code = "create", name = "创建采购入库")
    public ResponseEntity<PurchaseIn> create(@RequestBody PurchaseIn purchaseIn) {
        return ResponseEntity.ok(purchaseInService.create(purchaseIn));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新采购入库")
    public ResponseEntity<PurchaseIn> update(@PathVariable Long id, @RequestBody PurchaseIn purchaseIn) {
        purchaseIn.setId(id);
        return ResponseEntity.ok(purchaseInService.update(id, purchaseIn));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看采购入库")
    public ResponseEntity<PurchaseIn> getById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseInService.getById(id));
    }

    @GetMapping("/list")
    @Permission(code = "read", name = "查看采购入库")
    public ResponseEntity<List<PurchaseIn>> list(PurchaseIn query) {
        return ResponseEntity.ok(purchaseInService.list(query));
    }

    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核采购入库")
    public ResponseEntity<Void> approve(@PathVariable Long id, @RequestParam String userId) {
        purchaseInService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消采购入库")
    public ResponseEntity<Void> cancel(@PathVariable Long id, @RequestParam String reason) {
        purchaseInService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/complete")
    @Permission(code = "complete", name = "完成采购入库")
    public ResponseEntity<Void> complete(@PathVariable Long id) {
        purchaseInService.complete(id);
        return ResponseEntity.ok().build();
    }
}