package com.ims.procurement.controller;

import com.ims.procurement.dto.request.CreatePurchaseOrderRequest;
import com.ims.procurement.dto.request.UpdatePurchaseOrderRequest;
import com.ims.procurement.entity.PurchaseOrder;
import com.ims.procurement.service.PurchaseOrderService;
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
public class PurchaseOrderController {

    private static final Logger log = LoggerFactory.getLogger(PurchaseOrderController.class);

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    /**
     * 创建采购订单
     */
    @PostMapping
    public ResponseEntity<PurchaseOrder> create(@Valid @RequestBody CreatePurchaseOrderRequest request) {
        log.info("创建采购订单, supplierId: {}", request.getSupplierId());
        var result = purchaseOrderService.create(request);
        return ResponseEntity.ok(result);
    }

    /**
     * 更新采购订单
     */
    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrder> update(
            @PathVariable String id,
            @Valid @RequestBody UpdatePurchaseOrderRequest request) {
        log.info("更新采购订单, id: {}", id);
        var result = purchaseOrderService.update(id, request);
        return ResponseEntity.ok(result);
    }

    /**
     * 审核采购订单
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approve(
            @PathVariable String id,
            @RequestParam String userId) {
        log.info("审核采购订单, id: {}", id);
        purchaseOrderService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 取消采购订单
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(
            @PathVariable String id,
            @RequestParam String reason) {
        log.info("取消采购订单, id: {}", id);
        purchaseOrderService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> getById(@PathVariable String id) {
        var result = purchaseOrderService.getById(id);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    /**
     * 根据订单号查询
     */
    @GetMapping("/no/{orderNo}")
    public ResponseEntity<PurchaseOrder> getByOrderNo(@PathVariable String orderNo) {
        var result = purchaseOrderService.getByOrderNo(orderNo);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    /**
     * 查询列表
     */
    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> list(PurchaseOrder query) {
        var result = purchaseOrderService.list(query);
        return ResponseEntity.ok(result);
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        log.info("删除采购订单, id: {}", id);
        purchaseOrderService.delete(id);
        return ResponseEntity.ok().build();
    }
}