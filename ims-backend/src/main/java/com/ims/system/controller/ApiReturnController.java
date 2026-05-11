package com.ims.system.controller;

import com.ims.procurement.dto.request.CreatePurchaseReturnRequest;
import com.ims.procurement.dto.request.UpdatePurchaseReturnRequest;
import com.ims.procurement.entity.PurchaseReturn;
import com.ims.procurement.entity.PurchaseReturnDetail;
import com.ims.procurement.service.PurchaseReturnService;
import com.ims.system.annotation.Permission;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 采购退货API别名 - 兼容前端调用 /api/return/* 路径
 */
@RestController
@RequestMapping("/api/return")
@Permission(code = "purchase:return", name = "采购退货")
public class ApiReturnController {

    private final PurchaseReturnService purchaseReturnService;

    public ApiReturnController(PurchaseReturnService purchaseReturnService) {
        this.purchaseReturnService = purchaseReturnService;
    }

    @PostMapping
    @Permission(code = "create", name = "创建采购退货")
    public ResponseEntity<PurchaseReturn> create(@RequestBody CreatePurchaseReturnRequest request) {
        PurchaseReturn purchaseReturn = new PurchaseReturn();
        purchaseReturn.setSupplierId(request.getSupplierId());
        purchaseReturn.setPurchaseInId(request.getPurchaseInId());
        purchaseReturn.setReturnDate(request.getReturnDate());
        purchaseReturn.setWarehouseId(request.getWarehouseId());
        purchaseReturn.setReturnBy(request.getReturnBy());
        purchaseReturn.setReason(request.getReason());
        purchaseReturn.setRefundAmount(request.getRefundAmount());
        purchaseReturn.setRemark(request.getRemark());

        List<PurchaseReturnDetail> details = request.getDetails().stream()
                .map(this::toDetail)
                .toList();

        return ResponseEntity.ok(purchaseReturnService.create(purchaseReturn, details));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新采购退货")
    public ResponseEntity<PurchaseReturn> update(@PathVariable Long id, @RequestBody UpdatePurchaseReturnRequest request) {
        PurchaseReturn purchaseReturn = new PurchaseReturn();
        purchaseReturn.setSupplierId(request.getSupplierId());
        purchaseReturn.setPurchaseInId(request.getPurchaseInId());
        purchaseReturn.setReturnDate(request.getReturnDate());
        purchaseReturn.setWarehouseId(request.getWarehouseId());
        purchaseReturn.setReturnBy(request.getReturnBy());
        purchaseReturn.setReason(request.getReason());
        purchaseReturn.setRefundAmount(request.getRefundAmount());
        purchaseReturn.setRemark(request.getRemark());

        List<PurchaseReturnDetail> details = request.getDetails() != null
                ? request.getDetails().stream().map(this::toDetail).toList()
                : List.of();

        return ResponseEntity.ok(purchaseReturnService.update(id, purchaseReturn, details));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看采购退货")
    public ResponseEntity<PurchaseReturn> getById(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseReturnService.getById(id));
    }

    @GetMapping
    @Permission(code = "read", name = "查看采购退货")
    public ResponseEntity<List<PurchaseReturn>> list(PurchaseReturn query) {
        return ResponseEntity.ok(purchaseReturnService.list(query));
    }

    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核采购退货")
    public ResponseEntity<Void> approve(@PathVariable Long id, @RequestParam String userId) {
        purchaseReturnService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    @Permission(code = "reject", name = "拒绝采购退货")
    public ResponseEntity<Void> reject(@PathVariable Long id, @RequestParam String reason) {
        purchaseReturnService.reject(id, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消采购退货")
    public ResponseEntity<Void> cancel(@PathVariable Long id, @RequestParam String reason) {
        purchaseReturnService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/outbound")
    @Permission(code = "outbound", name = "采购退货出库")
    public ResponseEntity<Void> outbound(@PathVariable Long id, @RequestParam String userId) {
        purchaseReturnService.outbound(id, userId);
        return ResponseEntity.ok().build();
    }

    private PurchaseReturnDetail toDetail(CreatePurchaseReturnRequest.PurchaseReturnDetailRequest request) {
        PurchaseReturnDetail detail = new PurchaseReturnDetail();
        detail.setProductId(request.getProductId());
        detail.setProductName(request.getProductName());
        detail.setSpec(request.getSpec());
        detail.setUnit(request.getUnit());
        detail.setQuantity(request.getQuantity());
        detail.setPrice(request.getPrice());
        detail.setWarehouseId(request.getWarehouseId());
        detail.setLocationId(request.getLocationId());
        detail.setBatchNo(request.getBatchNo());
        return detail;
    }
}