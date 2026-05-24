package com.ims.inventory.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.inventory.entity.Inventory;
import com.ims.inventory.service.InventoryService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 库存台账 Controller
 */
@RestController
@RequestMapping("/api/inventory")
@Permission(code = "inventory", name = "库存管理")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    /**
     * 分页查询库存
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看库存")
    public Result<PageResult<Inventory>> page(
            @RequestParam Long page,
            @RequestParam Long pageSize,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long warehouseId) {

        Long offset = (page - 1) * pageSize;
        List<Inventory> records = inventoryService.selectPage(productId, warehouseId, pageSize, offset);
        long total = inventoryService.selectCount(productId, warehouseId);
        return Result.success(PageResult.build(records, total, page, pageSize));
    }

    /**
     * 查询库存详情
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看库存")
    public Result<Inventory> getById(@PathVariable Long id) {
        return Result.success(inventoryService.getById(id));
    }

    /**
     * 查询商品在指定仓库的库存
     */
    @GetMapping("/product/{productId}/warehouse/{warehouseId}")
    @Permission(code = "read", name = "查看库存")
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
    @Permission(code = "read", name = "查看库存")
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
    @Permission(code = "read", name = "查看库存")
    public Result<List<Inventory>> getByProduct(@PathVariable Long productId) {
        return Result.success(inventoryService.lambdaQuery()
            .eq(Inventory::getProductId, productId)
            .list());
    }

    /**
     * 查询库存预警列表 (库存低于安全库存)
     */
    @GetMapping("/warning")
    @Permission(code = "read", name = "查看库存")
    public Result<List<Inventory>> getWarningList() {
        return Result.success(inventoryService.getWarningList());
    }

    /**
     * 获取FIFO推荐批次（按生产日期升序）
     */
    @GetMapping("/fifo/{productId}")
    @Permission(code = "read", name = "查看库存")
    public Result<List<Inventory>> getFifoRecommend(
            @PathVariable Long productId,
            @RequestParam(required = false) Long warehouseId) {
        return Result.success(inventoryService.getInventoryListByProduct(productId, warehouseId));
    }

    /**
     * 获取临期商品预警（有效期≤N天）
     */
    @GetMapping("/expiring")
    @Permission(code = "read", name = "查看库存")
    public Result<List<Inventory>> getExpiringList(
            @RequestParam(defaultValue = "30") Integer days) {
        return Result.success(inventoryService.getExpiringList(days));
    }

    /**
     * 获取呆滞商品（N天未动）
     */
    @GetMapping("/idle")
    @Permission(code = "read", name = "查看库存")
    public Result<List<Inventory>> getIdleStock(
            @RequestParam(defaultValue = "90") Integer days) {
        return Result.success(inventoryService.getIdleStock(days));
    }

    /**
     * 获取最高库存预警列表（库存高于最高库存）
     */
    @GetMapping("/high-stock")
    @Permission(code = "read", name = "查看库存")
    public Result<List<Inventory>> getHighStockList() {
        return Result.success(inventoryService.getHighStockList());
    }

    /**
     * 冻结库存
     */
    @PostMapping("/{id}/freeze")
    @Permission(code = "update", name = "冻结库存")
    public Result<Void> freezeStock(
            @PathVariable Long id,
            @RequestParam BigDecimal quantity) {
        Inventory inventory = inventoryService.getById(id);
        if (inventory == null) {
            return Result.fail("库存记录不存在");
        }
        inventoryService.freezeStock(inventory.getProductId(), inventory.getWarehouseId(), quantity);
        return Result.success(null);
    }

    /**
     * 解冻库存
     */
    @PostMapping("/{id}/unfreeze")
    @Permission(code = "update", name = "解冻库存")
    public Result<Void> unfreezeStock(
            @PathVariable Long id,
            @RequestParam BigDecimal quantity) {
        Inventory inventory = inventoryService.getById(id);
        if (inventory == null) {
            return Result.fail("库存记录不存在");
        }
        inventoryService.unfreezeStock(inventory.getProductId(), inventory.getWarehouseId(), quantity);
        return Result.success(null);
    }
}