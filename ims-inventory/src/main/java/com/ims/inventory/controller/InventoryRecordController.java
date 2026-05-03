package com.ims.inventory.controller;

import com.ims.core.dto.PageResult;
import com.ims.core.dto.Result;
import com.ims.inventory.entity.InventoryRecord;
import com.ims.inventory.service.InventoryRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 库存变动记录 Controller
 */
@RestController
@RequestMapping("/api/inventory/record")
public class InventoryRecordController {
    
    @Autowired
    private InventoryRecordService inventoryRecordService;

    /**
     * 分页查询变动记录
     */
    @GetMapping("/page")
    public Result<PageResult<InventoryRecord>> page(
            @RequestParam Long page,
            @RequestParam Long pageSize,
            @RequestParam(required = false) Long productId,
            @RequestParam(required = false) Long warehouseId,
            @RequestParam(required = false) String changeType) {
        
        return Result.success(inventoryRecordService.pageRecord(page, pageSize, productId, warehouseId, changeType));
    }

    /**
     * 查询单据关联的变动记录
     */
    @GetMapping("/order")
    public Result<List<InventoryRecord>> getByOrder(
            @RequestParam String orderType,
            @RequestParam Long orderId) {
        
        return Result.success(inventoryRecordService.getByOrder(orderType, orderId));
    }
}