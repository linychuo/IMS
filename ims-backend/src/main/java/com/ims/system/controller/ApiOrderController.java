package com.ims.system.controller;

import com.ims.procurement.dto.request.CreatePurchaseOrderRequest;
import com.ims.procurement.dto.request.UpdatePurchaseOrderRequest;
import com.ims.procurement.entity.PurchaseOrder;
import com.ims.procurement.service.PurchaseOrderService;
import com.ims.system.annotation.Permission;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 采购订单API别名 - 兼容前端调用 /api/orders/* 路径
 */
@RestController
@RequestMapping("/api/orders")
@Permission(code = "purchase:order", name = "采购订单")
public class ApiOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public ApiOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @PostMapping
    @Permission(code = "create", name = "创建采购订单")
    public ResponseEntity<PurchaseOrder> create(@RequestBody CreatePurchaseOrderRequest request) {
        return ResponseEntity.ok(purchaseOrderService.create(request));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新采购订单")
    public ResponseEntity<PurchaseOrder> update(@PathVariable Long id, @RequestBody UpdatePurchaseOrderRequest request) {
        return ResponseEntity.ok(purchaseOrderService.update(id, request));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看采购订单")
    public ResponseEntity<PurchaseOrder> getById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseOrderService.getById(id));
    }

    @GetMapping
    @Permission(code = "read", name = "查看采购订单")
    public ResponseEntity<List<PurchaseOrder>> list(PurchaseOrder query) {
        return ResponseEntity.ok(purchaseOrderService.list(query));
    }

    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核采购订单")
    public ResponseEntity<Void> approve(@PathVariable Long id, @RequestParam String userId) {
        purchaseOrderService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消采购订单")
    public ResponseEntity<Void> cancel(@PathVariable Long id, @RequestParam String reason) {
        purchaseOrderService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }
}