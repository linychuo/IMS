package com.ims.procurement.controller;

import com.ims.core.result.Result;
import com.ims.procurement.dto.request.InspectionRequest;
import com.ims.procurement.entity.PurchaseIn;
import com.ims.procurement.service.PurchaseInService;
import com.ims.system.annotation.Permission;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 采购入库控制器
 */
@RestController
@RequestMapping("/api/procurement/purchase-in")
@Permission(code = "purchase:in", name = "采购入库")
public class PurchaseInController {

    private static final Logger log = LoggerFactory.getLogger(PurchaseInController.class);

    private final PurchaseInService purchaseInService;

    public PurchaseInController(PurchaseInService purchaseInService) {
        this.purchaseInService = purchaseInService;
    }

    @PostMapping
    @Permission(code = "create", name = "创建采购入库")
    public Result<PurchaseIn> create(@Valid @RequestBody PurchaseIn purchaseIn) {
        return Result.success(purchaseInService.create(purchaseIn));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新采购入库")
    public Result<PurchaseIn> update(@PathVariable Long id,
                                      @Valid @RequestBody PurchaseIn purchaseIn) {
        return Result.success(purchaseInService.update(id, purchaseIn));
    }

    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核采购入库")
    public Result<Void> approve(@PathVariable Long id,
                                 @RequestParam String userId) {
        purchaseInService.approve(id, userId);
        return Result.success(null);
    }

    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消采购入库")
    public Result<Void> cancel(@PathVariable Long id,
                                @RequestParam String reason) {
        purchaseInService.cancel(id, reason);
        return Result.success(null);
    }

    @PostMapping("/{id}/complete")
    @Permission(code = "complete", name = "完成采购入库")
    public Result<Void> complete(@PathVariable Long id) {
        purchaseInService.complete(id);
        return Result.success(null);
    }

    @PostMapping("/{id}/inspect")
    @Permission(code = "inspect", name = "提交检验结果")
    public Result<Void> inspect(@PathVariable Long id,
                                @Valid @RequestBody InspectionRequest request) {
        purchaseInService.inspect(id, request);
        return Result.success(null);
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看采购入库")
    public Result<PurchaseIn> getById(@PathVariable Long id) {
        return Result.success(purchaseInService.getById(id));
    }

    @GetMapping("/no/{inNo}")
    @Permission(code = "read", name = "查看采购入库")
    public Result<PurchaseIn> getByInNo(@PathVariable String inNo) {
        return Result.success(purchaseInService.getByInNo(inNo));
    }

    @GetMapping("/list")
    @Permission(code = "read", name = "查看采购入库")
    public Result<List<PurchaseIn>> list(PurchaseIn query) {
        return Result.success(purchaseInService.list(query));
    }
}