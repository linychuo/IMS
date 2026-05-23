package com.ims.inventory.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.inventory.dto.InventoryTransferRequest;
import com.ims.inventory.entity.InventoryTransfer;
import com.ims.inventory.entity.InventoryTransferDetail;
import com.ims.inventory.service.InventoryTransferService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 库存调拨控制器
 */
@RestController
@RequestMapping("/api/inventory/transfer")
@Permission(code = "inventory:transfer", name = "库存调拨")
public class InventoryTransferController {

    @Autowired
    private InventoryTransferService inventoryTransferService;

    /**
     * 分页查询
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看调拨单")
    public Result<PageResult<InventoryTransfer>> page(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) Long fromWarehouseId,
            @RequestParam(required = false) Long toWarehouseId,
            @RequestParam(required = false) Integer status) {
        return Result.success(inventoryTransferService.page(page, pageSize, fromWarehouseId, toWarehouseId, status));
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看调拨单")
    public Result<InventoryTransfer> getById(@PathVariable Long id) {
        return Result.success(inventoryTransferService.getById(id));
    }

    /**
     * 创建调拨单
     */
    @PostMapping
    @Permission(code = "create", name = "创建调拨单")
    public Result<InventoryTransfer> create(@RequestBody InventoryTransferRequest request) {
        return Result.success(inventoryTransferService.create(request.getTransfer(), request.getDetails()));
    }

    /**
     * 审核调拨单
     */
    @PutMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核调拨单")
    public Result<Boolean> approve(@PathVariable Long id, @RequestParam Long auditorId) {
        return Result.success(inventoryTransferService.approve(id, auditorId));
    }

    /**
     * 开始调拨
     */
    @PutMapping("/{id}/start")
    @Permission(code = "update", name = "更新调拨单")
    public Result<Boolean> startTransfer(@PathVariable Long id, @RequestParam Long transfererId) {
        return Result.success(inventoryTransferService.startTransfer(id, transfererId));
    }

    /**
     * 确认出库
     */
    @PutMapping("/{id}/confirm-out")
    @Permission(code = "update", name = "更新调拨单")
    public Result<Boolean> confirmOut(@PathVariable Long id) {
        return Result.success(inventoryTransferService.confirmOut(id));
    }

    /**
     * 确认入库
     */
    @PutMapping("/{id}/confirm-in")
    @Permission(code = "update", name = "更新调拨单")
    public Result<Boolean> confirmIn(@PathVariable Long id) {
        return Result.success(inventoryTransferService.confirmIn(id));
    }

    /**
     * 完成调拨
     */
    @PutMapping("/{id}/finish")
    @Permission(code = "update", name = "更新调拨单")
    public Result<Boolean> finishTransfer(@PathVariable Long id) {
        return Result.success(inventoryTransferService.finishTransfer(id));
    }

    /**
     * 取消调拨
     */
    @PutMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消调拨单")
    public Result<Boolean> cancelTransfer(@PathVariable Long id, @RequestParam String reason) {
        return Result.success(inventoryTransferService.cancelTransfer(id, reason));
    }

    /**
     * 获取调拨明细
     */
    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看调拨单")
    public Result<List<InventoryTransferDetail>> getDetails(@PathVariable Long id) {
        return Result.success(inventoryTransferService.getDetails(id));
    }

    /**
     * 查询进行中的调拨
     */
    @GetMapping("/pending")
    @Permission(code = "read", name = "查看调拨单")
    public Result<List<InventoryTransfer>> listPending() {
        return Result.success(inventoryTransferService.listPending());
    }
}