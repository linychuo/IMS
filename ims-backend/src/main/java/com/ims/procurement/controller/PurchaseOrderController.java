package com.ims.procurement.controller;

import com.ims.core.result.Result;
import com.ims.procurement.dto.request.CreatePurchaseOrderRequest;
import com.ims.procurement.dto.request.UpdatePurchaseOrderRequest;
import com.ims.procurement.entity.PurchaseOrder;
import com.ims.procurement.service.PurchaseOrderService;
import com.ims.system.annotation.Permission;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
    public Result<PurchaseOrder> create(@Valid @RequestBody CreatePurchaseOrderRequest request) {
        log.info("创建采购订单, supplierId: {}", request.getSupplierId());
        var result = purchaseOrderService.create(request);
        return Result.success(result);
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新采购订单")
    public Result<PurchaseOrder> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePurchaseOrderRequest request) {
        log.info("更新采购订单, id: {}", id);
        var result = purchaseOrderService.update(id, request);
        return Result.success(result);
    }

    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核采购订单")
    public Result<Void> approve(
            @PathVariable Long id,
            @RequestParam String userId) {
        log.info("审核采购订单, id: {}", id);
        purchaseOrderService.approve(id, userId);
        return Result.success(null);
    }

    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消采购订单")
    public Result<Void> cancel(
            @PathVariable Long id,
            @RequestParam String reason) {
        log.info("取消采购订单, id: {}", id);
        purchaseOrderService.cancel(id, reason);
        return Result.success(null);
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看采购订单")
    public Result<PurchaseOrder> getById(@PathVariable Long id) {
        var result = purchaseOrderService.getById(id);
        return result != null ? Result.success(result) : Result.error("采购订单不存在");
    }

    @GetMapping("/no/{orderNo}")
    @Permission(code = "read", name = "查看采购订单")
    public Result<PurchaseOrder> getByOrderNo(@PathVariable String orderNo) {
        var result = purchaseOrderService.getByOrderNo(orderNo);
        return result != null ? Result.success(result) : Result.error("采购订单不存在");
    }

    @GetMapping
    @Permission(code = "read", name = "查看采购订单")
    public Result<List<PurchaseOrder>> list(PurchaseOrder query) {
        var result = purchaseOrderService.list(query);
        return Result.success(result);
    }

    /**
     * 获取即将到货的订单（N天内）
     */
    @GetMapping("/incoming")
    @Permission(code = "read", name = "查看采购订单")
    public Result<List<PurchaseOrder>> getIncomingOrders(
            @RequestParam(defaultValue = "7") Integer days) {
        return Result.success(purchaseOrderService.getIncomingOrders(days));
    }

    /**
     * 获取已逾期未入库的订单
     */
    @GetMapping("/overdue")
    @Permission(code = "read", name = "查看采购订单")
    public Result<List<PurchaseOrder>> getOverdueOrders() {
        return Result.success(purchaseOrderService.getOverdueOrders());
    }
}