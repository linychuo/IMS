package com.ims.inventory.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.inventory.entity.Inventory;
import com.ims.inventory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 库存台账 Controller
 */
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    
    @Autowired
    private InventoryService inventoryService;

    /**
     * 分页查询库存
     */
    @GetMapping("/page")
    public Result<PageResult<Inventory>> page(
            @RequestParam Long page,
            @RequestParam Long pageSize,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long warehouseId) {
        
        LambdaQueryWrapper<Inventory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(productId != null, Inventory::getProductId, productId)
               .eq(warehouseId != null, Inventory::getWarehouseId, warehouseId)
               .orderByDesc(Inventory::getId);
        
        Page<Inventory> result = inventoryService.page(new Page<>(page, pageSize), wrapper);
        
        return Result.success(PageResult.of(result));
    }

    /**
     * 查询库存详情
     */
    @GetMapping("/{id}")
    public Result<Inventory> getById(@PathVariable Long id) {
        return Result.success(inventoryService.getById(id));
    }

    /**
     * 查询商品在指定仓库的库存
     */
    @GetMapping("/product/{productId}/warehouse/{warehouseId}")
    public Result<Inventory> getByProductAndWarehouse(
            @PathVariable Long productId,
            @PathVariable Long warehouseId) {
        
        return Result.success(inventoryService.lambdaQuery()
            .eq(Inventory::getProductId, productId)
            .eq(Inventory::getWarehouseId, warehouseId)
            .one());
    }

    /**
     * 查询商品在指定仓库的可用库存
     */
    @GetMapping("/available")
    public Result<BigDecimal> getAvailableQuantity(
            @RequestParam Long productId,
            @RequestParam Long warehouseId) {
        
        BigDecimal available = inventoryService.getAvailableQuantity(productId, warehouseId);
        return Result.success(available);
    }

    /**
     * 查询商品所有仓库的总库存
     */
    @GetMapping("/product/{productId}/total")
    public Result<List<Inventory>> getByProduct(@PathVariable Long productId) {
        return Result.success(inventoryService.lambdaQuery()
            .eq(Inventory::getProductId, productId)
            .list());
    }

    /**
     * 查询库存预警列表 (库存低于安全库存)
     */
    @GetMapping("/warning")
    public Result<List<Inventory>> getWarningList() {
        // TODO: 需要关联商品表，查询 min_stock
        return Result.success(null);
    }
}