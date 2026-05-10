package com.ims.inventory.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.inventory.entity.InventoryIn;
import com.ims.inventory.entity.InventoryInDetail;
import com.ims.inventory.service.InventoryInService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 入库单 Controller
 */
@RestController
@RequestMapping("/api/inventory/in")
@Permission(code = "inventory:in", name = "入库管理")
public class InventoryInController {

    @Autowired
    private InventoryInService inventoryInService;

    /**
     * 分页查询入库单
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看入库单")
    public Result<PageResult<InventoryIn>> page(
            @RequestParam Long page,
            @RequestParam Long pageSize,
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) Integer inType,
            @RequestParam(required = false) Integer status) {

        return Result.success(inventoryInService.pageIn(page, pageSize, warehouseId, inType, status));
    }

    /**
     * 查询入库单详情
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看入库单")
    public Result<InventoryIn> getById(@PathVariable Long id) {
        return Result.success(inventoryInService.getInById(id));
    }

    /**
     * 查询入库明细
     */
    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看入库单")
    public Result<List<InventoryInDetail>> getDetails(@PathVariable Long id) {
        return Result.success(inventoryInService.getInDetails(id));
    }

    /**
     * 新增入库单
     */
    @PostMapping
    @Permission(code = "create", name = "创建入库单")
    public Result<Boolean> save(@RequestBody InventoryIn in) {
        return Result.success(inventoryInService.saveIn(in));
    }

    /**
     * 新增入库单(含明细)
     */
    @PostMapping("/with-details")
    @Permission(code = "create", name = "创建入库单")
    public Result<Boolean> saveWithDetails(@RequestBody InventoryIn in, @RequestBody List<InventoryInDetail> details) {
        return Result.success(inventoryInService.saveInWithDetails(in, details));
    }

    /**
     * 审核入库单
     */
    @PostMapping("/{id}/audit")
    @Permission(code = "audit", name = "审核入库单")
    public Result<Boolean> audit(@PathVariable Long id, @RequestParam Long auditorId) {
        return Result.success(inventoryInService.auditIn(id, auditorId));
    }

    /**
     * 取消入库单
     */
    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消入库单")
    public Result<Boolean> cancel(@PathVariable Long id) {
        return Result.success(inventoryInService.cancelIn(id));
    }
}