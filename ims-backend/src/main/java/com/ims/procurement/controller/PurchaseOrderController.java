package com.ims.procurement.controller;

import com.ims.procurement.dto.request.CreatePurchaseOrderRequest;
import com.ims.procurement.dto.request.UpdatePurchaseOrderRequest;
import com.ims.procurement.entity.PurchaseOrder;
import com.ims.procurement.service.PurchaseOrderService;
import com.ims.system.annotation.Permission;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 采购订单 Controller
 */
@RestController
@RequestMapping("/api/procurement/orders")
@Permission(code = "purchase:order", name = "采购订单")
public class PurchaseOrderController {

    private static final Logger log = LoggerFactory.getLogger(PurchaseOrderController.class);

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @PostMapping
    @Permission(code = "create", name = "创建采购订单")
    public ResponseEntity<PurchaseOrder> create(@Valid @RequestBody CreatePurchaseOrderRequest request) {
        log.info("创建采购订单, supplierId: {}", request.getSupplierId());
        var result = purchaseOrderService.create(request);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新采购订单")
    public ResponseEntity<PurchaseOrder> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePurchaseOrderRequest request) {
        log.info("更新采购订单, id: {}", id);
        var result = purchaseOrderService.update(id, request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核采购订单")
    public ResponseEntity<Void> approve(
            @PathVariable Long id,
            @RequestParam String userId) {
        log.info("审核采购订单, id: {}", id);
        purchaseOrderService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消采购订单")
    public ResponseEntity<Void> cancel(
            @PathVariable Long id,
            @RequestParam String reason) {
        log.info("取消采购订单, id: {}", id);
        purchaseOrderService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看采购订单")
    public ResponseEntity<PurchaseOrder> getById(@PathVariable Long id) {
        var result = purchaseOrderService.getById(id);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @GetMapping("/no/{orderNo}")
    @Permission(code = "read", name = "查看采购订单")
    public ResponseEntity<PurchaseOrder> getByOrderNo(@PathVariable String orderNo) {
        var result = purchaseOrderService.getByOrderNo(orderNo);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @GetMapping
    @Permission(code = "read", name = "查看采购订单")
    public ResponseEntity<List<PurchaseOrder>> list(PurchaseOrder query) {
        var result = purchaseOrderService.list(query);
        return ResponseEntity.ok(result);
    }
}