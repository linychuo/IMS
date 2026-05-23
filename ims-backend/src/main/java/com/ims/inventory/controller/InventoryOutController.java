package com.ims.inventory.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.inventory.dto.InventoryOutRequest;
import com.ims.inventory.entity.InventoryOut;
import com.ims.inventory.entity.InventoryOutDetail;
import com.ims.inventory.service.InventoryOutService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 出库单 Controller
 */
@RestController
@RequestMapping("/api/inventory/out")
@Permission(code = "inventory:out", name = "出库管理")
public class InventoryOutController {

    @Autowired
    private InventoryOutService inventoryOutService;

    /**
     * 分页查询出库单
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看出库单")
    public Result<PageResult<InventoryOut>> page(
            @RequestParam Long page,
            @RequestParam Long pageSize,
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) Integer outType,
            @RequestParam(required = false) Integer status) {

        return Result.success(inventoryOutService.pageOut(page, pageSize, warehouseId, outType, status));
    }

    /**
     * 查询出库单详情
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看出库单")
    public Result<InventoryOut> getById(@PathVariable Long id) {
        return Result.success(inventoryOutService.getOutById(id));
    }

    /**
     * 查询出库明细
     */
    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看出库单")
    public Result<List<InventoryOutDetail>> getDetails(@PathVariable Long id) {
        return Result.success(inventoryOutService.getOutDetails(id));
    }

    /**
     * 新增出库单
     */
    @PostMapping
    @Permission(code = "create", name = "创建出库单")
    public Result<Boolean> save(@RequestBody InventoryOut out) {
        return Result.success(inventoryOutService.saveOut(out));
    }

    /**
     * 新增出库单(含明细)
     */
    @PostMapping("/with-details")
    @Permission(code = "create", name = "创建出库单")
    public Result<Boolean> saveWithDetails(@RequestBody InventoryOutRequest request) {
        return Result.success(inventoryOutService.saveOutWithDetails(request.getOut(), request.getDetails()));
    }

    /**
     * 审核出库单
     */
    @PostMapping("/{id}/audit")
    @Permission(code = "audit", name = "审核出库单")
    public Result<Boolean> audit(@PathVariable Long id, @RequestParam Long auditorId) {
        return Result.success(inventoryOutService.auditOut(id, auditorId));
    }

    /**
     * 取消出库单
     */
    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消出库单")
    public Result<Boolean> cancel(@PathVariable Long id) {
        return Result.success(inventoryOutService.cancelOut(id));
    }

    /**
     * 扫码出库 - 根据条码查询商品信息
     */
    @GetMapping("/barcode/{barcode}")
    @Permission(code = "read", name = "查看出库单")
    public Result<InventoryOutDetail> getByBarcode(@PathVariable String barcode) {
        return Result.success(inventoryOutService.getByBarcode(barcode));
    }
}