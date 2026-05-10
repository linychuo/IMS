package com.ims.inventory.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.inventory.dto.InventoryCheckRequest;
import com.ims.inventory.entity.InventoryCheck;
import com.ims.inventory.entity.InventoryCheckDetail;
import com.ims.inventory.service.InventoryCheckService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 库存盘点控制器
 */
@RestController
@RequestMapping("/api/inventory/check")
@Permission(code = "inventory:check", name = "库存盘点")
public class InventoryCheckController {

    @Autowired
    private InventoryCheckService inventoryCheckService;

    /**
     * 分页查询
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看盘点单")
    public Result<PageResult<InventoryCheck>> page(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) Integer status) {
        return Result.success(inventoryCheckService.page(page, pageSize, warehouseId, status));
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看盘点单")
    public Result<InventoryCheck> getById(@PathVariable Long id) {
        return Result.success(inventoryCheckService.getById(id));
    }

    /**
     * 创建盘点单
     */
    @PostMapping
    @Permission(code = "create", name = "创建盘点单")
    public Result<InventoryCheck> create(@RequestBody InventoryCheckRequest request) {
        return Result.success(inventoryCheckService.create(request.getCheck(), request.getDetails()));
    }

    /**
     * 开始盘点
     */
    @PutMapping("/{id}/start")
    @Permission(code = "update", name = "更新盘点单")
    public Result<Boolean> startCheck(@PathVariable Long id, @RequestParam Long checkerId) {
        return Result.success(inventoryCheckService.startCheck(id, checkerId));
    }

    /**
     * 提交盘点结果
     */
    @PutMapping("/{id}/submit")
    @Permission(code = "update", name = "更新盘点单")
    public Result<Boolean> submitResult(@PathVariable Long id,
                                        @RequestBody InventoryCheckRequest request) {
        return Result.success(inventoryCheckService.submitResult(id, request.getDetails()));
    }

    /**
     * 完成盘点
     */
    @PutMapping("/{id}/finish")
    @Permission(code = "update", name = "更新盘点单")
    public Result<Boolean> finishCheck(@PathVariable Long id) {
        return Result.success(inventoryCheckService.finishCheck(id));
    }

    /**
     * 取消盘点
     */
    @PutMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消盘点单")
    public Result<Boolean> cancelCheck(@PathVariable Long id, @RequestParam String reason) {
        return Result.success(inventoryCheckService.cancelCheck(id, reason));
    }

    /**
     * 获取盘点明细
     */
    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看盘点单")
    public Result<List<InventoryCheckDetail>> getDetails(@PathVariable Long id) {
        return Result.success(inventoryCheckService.getDetails(id));
    }

    /**
     * 查询进行中的盘点
     */
    @GetMapping("/pending")
    @Permission(code = "read", name = "查看盘点单")
    public Result<List<InventoryCheck>> listPending(@RequestParam(required = false) Long warehouseId) {
        return Result.success(inventoryCheckService.listPending(warehouseId));
    }
}