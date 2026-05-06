package com.ims.inventory.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.inventory.entity.InventoryTransfer;
import com.ims.inventory.entity.InventoryTransferDetail;
import com.ims.inventory.service.InventoryTransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 库存调拨控制器
 */
@RestController
@RequestMapping("/api/inventory/transfer")
public class InventoryTransferController {

    @Autowired
    private InventoryTransferService inventoryTransferService;

    /**
     * 分页查询
     */
    @GetMapping("/page")
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
    public Result<InventoryTransfer> getById(@PathVariable Long id) {
        return Result.success(inventoryTransferService.getById(id));
    }

    /**
     * 创建调拨单
     */
    @PostMapping
    public Result<InventoryTransfer> create(@RequestBody InventoryTransfer transfer,
                                             @RequestBody List<InventoryTransferDetail> details) {
        return Result.success(inventoryTransferService.create(transfer, details));
    }

    /**
     * 开始调拨
     */
    @PutMapping("/{id}/start")
    public Result<Boolean> startTransfer(@PathVariable Long id, @RequestParam Long transfererId) {
        return Result.success(inventoryTransferService.startTransfer(id, transfererId));
    }

    /**
     * 确认出库
     */
    @PutMapping("/{id}/confirm-out")
    public Result<Boolean> confirmOut(@PathVariable Long id) {
        return Result.success(inventoryTransferService.confirmOut(id));
    }

    /**
     * 确认入库
     */
    @PutMapping("/{id}/confirm-in")
    public Result<Boolean> confirmIn(@PathVariable Long id) {
        return Result.success(inventoryTransferService.confirmIn(id));
    }

    /**
     * 完成调拨
     */
    @PutMapping("/{id}/finish")
    public Result<Boolean> finishTransfer(@PathVariable Long id) {
        return Result.success(inventoryTransferService.finishTransfer(id));
    }

    /**
     * 取消调拨
     */
    @PutMapping("/{id}/cancel")
    public Result<Boolean> cancelTransfer(@PathVariable Long id, @RequestParam String reason) {
        return Result.success(inventoryTransferService.cancelTransfer(id, reason));
    }

    /**
     * 获取调拨明细
     */
    @GetMapping("/{id}/details")
    public Result<List<InventoryTransferDetail>> getDetails(@PathVariable Long id) {
        return Result.success(inventoryTransferService.getDetails(id));
    }

    /**
     * 查询进行中的调拨
     */
    @GetMapping("/pending")
    public Result<List<InventoryTransfer>> listPending() {
        return Result.success(inventoryTransferService.listPending());
    }
}