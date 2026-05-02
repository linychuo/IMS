package com.ims.inventory.controller;

import com.ims.core.dto.PageResult;
import com.ims.core.dto.Result;
import com.ims.inventory.entity.InventoryOut;
import com.ims.inventory.entity.InventoryOutDetail;
import com.ims.inventory.service.InventoryOutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 出库单 Controller
 */
@RestController
@RequestMapping("/api/inventory/out")
public class InventoryOutController {
    
    @Autowired
    private InventoryOutService inventoryOutService;

    /**
     * 分页查询出库单
     */
    @GetMapping("/page")
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
    public Result<InventoryOut> getById(@PathVariable Long id) {
        return Result.success(inventoryOutService.getOutById(id));
    }

    /**
     * 查询出库明细
     */
    @GetMapping("/{id}/details")
    public Result<List<InventoryOutDetail>> getDetails(@PathVariable Long id) {
        return Result.success(inventoryOutService.getOutDetails(id));
    }

    /**
     * 新增出库单
     */
    @PostMapping
    public Result<Boolean> save(@RequestBody InventoryOut out) {
        return Result.success(inventoryOutService.saveOut(out));
    }

    /**
     * 新增出库单(含明细)
     */
    @PostMapping("/with-details")
    public Result<Boolean> saveWithDetails(@RequestBody InventoryOut out, @RequestBody List<InventoryOutDetail> details) {
        return Result.success(inventoryOutService.saveOutWithDetails(out, details));
    }

    /**
     * 审核出库单
     */
    @PostMapping("/{id}/audit")
    public Result<Boolean> audit(@PathVariable Long id, @RequestParam Long auditorId) {
        return Result.success(inventoryOutService.auditOut(id, auditorId));
    }

    /**
     * 取消出库单
     */
    @PostMapping("/{id}/cancel")
    public Result<Boolean> cancel(@PathVariable Long id) {
        return Result.success(inventoryOutService.cancelOut(id));
    }
}