package com.ims.procurement.controller;

import com.ims.procurement.dto.request.CreatePurchaseReturnRequest;
import com.ims.procurement.dto.request.UpdatePurchaseReturnRequest;
import com.ims.procurement.entity.PurchaseReturn;
import com.ims.procurement.entity.PurchaseReturnDetail;
import com.ims.procurement.service.PurchaseReturnService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 采购退货 Controller
 */
@RestController
@RequestMapping("/api/procurement/return")
public class PurchaseReturnController {

    private static final Logger log = LoggerFactory.getLogger(PurchaseReturnController.class);

    private final PurchaseReturnService purchaseReturnService;

    public PurchaseReturnController(PurchaseReturnService purchaseReturnService) {
        this.purchaseReturnService = purchaseReturnService;
    }

    @PostMapping
    public ResponseEntity<PurchaseReturn> create(@Valid @RequestBody CreatePurchaseReturnRequest request) {
        log.info("创建采购退货单, supplierId: {}", request.getSupplierId());

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

        var result = purchaseReturnService.create(purchaseReturn, details);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseReturn> update(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePurchaseReturnRequest request) {
        log.info("更新采购退货单, id: {}", id);

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

        var result = purchaseReturnService.update(id, purchaseReturn, details);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approve(
            @PathVariable Long id,
            @RequestParam String userId) {
        log.info("审核采购退货单, id: {}", id);
        purchaseReturnService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Void> reject(
            @PathVariable Long id,
            @RequestParam String reason) {
        log.info("拒绝采购退货单, id: {}", id);
        purchaseReturnService.reject(id, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(
            @PathVariable Long id,
            @RequestParam String reason) {
        log.info("取消采购退货单, id: {}", id);
        purchaseReturnService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/outbound")
    public ResponseEntity<Void> outbound(
            @PathVariable Long id,
            @RequestParam String userId) {
        log.info("采购退货出库, id: {}", id);
        purchaseReturnService.outbound(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseReturn> getById(@PathVariable Long id) {
        var result = purchaseReturnService.getById(id);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @GetMapping("/no/{returnNo}")
    public ResponseEntity<PurchaseReturn> getByReturnNo(@PathVariable String returnNo) {
        var result = purchaseReturnService.getByReturnNo(returnNo);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<List<PurchaseReturnDetail>> getDetails(@PathVariable Long id) {
        var result = purchaseReturnService.getDetails(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<PurchaseReturn>> list(PurchaseReturn query) {
        var result = purchaseReturnService.list(query);
        return ResponseEntity.ok(result);
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