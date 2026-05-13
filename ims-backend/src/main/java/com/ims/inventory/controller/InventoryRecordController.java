package com.ims.inventory.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.inventory.entity.InventoryRecord;
import com.ims.inventory.service.InventoryRecordService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 库存变动记录 Controller
 */
@RestController
@RequestMapping("/api/inventory/record")
@Permission(code = "inventory:record", name = "库存记录")
public class InventoryRecordController {

    @Autowired
    private InventoryRecordService inventoryRecordService;

    /**
     * 分页查询变动记录
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看库存记录")
    public Result<PageResult<InventoryRecord>> page(
            @RequestParam Long page,
            @RequestParam Long pageSize,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) String changeType) {

        Long offset = (page - 1) * pageSize;
        List<InventoryRecord> records = inventoryRecordService.selectPage(productId, warehouseId, changeType, pageSize, offset);
        long total = inventoryRecordService.selectCount(productId, warehouseId, changeType);
        return Result.success(PageResult.build(records, total, page, pageSize));
    }

    /**
     * 查询单据关联的变动记录
     */
    @GetMapping("/order")
    @Permission(code = "read", name = "查看库存记录")
    public Result<List<InventoryRecord>> getByOrder(
            @RequestParam String orderType,
            @RequestParam Long orderId) {

        return Result.success(inventoryRecordService.getByOrder(orderType, orderId));
    }
}