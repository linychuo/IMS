package com.ims.procurement.controller;

import com.ims.core.result.Result;
import com.ims.procurement.dto.request.CreatePurchaseReturnRequest;
import com.ims.procurement.dto.request.UpdatePurchaseReturnRequest;
import com.ims.procurement.entity.PurchaseReturn;
import com.ims.procurement.entity.PurchaseReturnDetail;
import com.ims.procurement.service.PurchaseReturnService;
import com.ims.system.annotation.Permission;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 采购退货 Controller
 */
@RestController
@RequestMapping("/api/procurement/return")
@Permission(code = "purchase:return", name = "采购退货")
public class PurchaseReturnController {

    private static final Logger log = LoggerFactory.getLogger(PurchaseReturnController.class);

    private final PurchaseReturnService purchaseReturnService;

    public PurchaseReturnController(PurchaseReturnService purchaseReturnService) {
        this.purchaseReturnService = purchaseReturnService;
    }

    @PostMapping
    @Permission(code = "create", name = "创建采购退货")
    public Result<PurchaseReturn> create(@Valid @RequestBody CreatePurchaseReturnRequest request) {
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
        return Result.success(result);
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新采购退货")
    public Result<PurchaseReturn> update(
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
        return Result.success(result);
    }

    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核采购退货")
    public Result<Void> approve(
            @PathVariable Long id,
            @RequestParam String userId) {
        log.info("审核采购退货单, id: {}", id);
        purchaseReturnService.approve(id, userId);
        return Result.success(null);
    }

    @PostMapping("/{id}/reject")
    @Permission(code = "reject", name = "拒绝采购退货")
    public Result<Void> reject(
            @PathVariable Long id,
            @RequestParam String reason) {
        log.info("拒绝采购退货单, id: {}", id);
        purchaseReturnService.reject(id, reason);
        return Result.success(null);
    }

    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消采购退货")
    public Result<Void> cancel(
            @PathVariable Long id,
            @RequestParam String reason) {
        log.info("取消采购退货单, id: {}", id);
        purchaseReturnService.cancel(id, reason);
        return Result.success(null);
    }

    @PostMapping("/{id}/outbound")
    @Permission(code = "outbound", name = "采购退货出库")
    public Result<Void> outbound(
            @PathVariable Long id,
            @RequestParam String userId) {
        log.info("采购退货出库, id: {}", id);
        purchaseReturnService.outbound(id, userId);
        return Result.success(null);
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看采购退货")
    public Result<PurchaseReturn> getById(@PathVariable Long id) {
        var result = purchaseReturnService.getById(id);
        return result != null ? Result.success(result) : Result.error("采购退货单不存在");
    }

    @GetMapping("/no/{returnNo}")
    @Permission(code = "read", name = "查看采购退货")
    public Result<PurchaseReturn> getByReturnNo(@PathVariable String returnNo) {
        var result = purchaseReturnService.getByReturnNo(returnNo);
        return result != null ? Result.success(result) : Result.error("采购退货单不存在");
    }

    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看采购退货")
    public Result<List<PurchaseReturnDetail>> getDetails(@PathVariable Long id) {
        var result = purchaseReturnService.getDetails(id);
        return Result.success(result);
    }

    @GetMapping
    @Permission(code = "read", name = "查看采购退货")
    public Result<List<PurchaseReturn>> list(PurchaseReturn query) {
        var result = purchaseReturnService.list(query);
        return Result.success(result);
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