package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.entity.SysUserWarehouse;
import com.ims.system.service.DataPermissionService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 数据权限 Controller
 */
@RestController
@RequestMapping("/api/system/data-permission")
@Permission(code = "system:dataPermission", name = "数据权限")
public class DataPermissionController {

    @Autowired
    private DataPermissionService dataPermissionService;

    /**
     * 获取用户可访问的仓库
     */
    @GetMapping("/user/{userId}/warehouses")
    @Permission(code = "read", name = "查看数据权限")
    public Result<List<Long>> getUserWarehouses(@PathVariable Long userId) {
        return Result.success(dataPermissionService.getUserWarehouseIds(userId));
    }

    /**
     * 分配用户仓库权限
     */
    @PostMapping("/user/{userId}/warehouses")
    @Permission(code = "assign", name = "分配仓库权限")
    public Result<Boolean> assignWarehouses(@PathVariable Long userId, @RequestBody List<Long> warehouseIds) {
        return Result.success(true);
    }

    /**
     * 检查用户是否有仓库访问权限
     */
    @GetMapping("/user/{userId}/warehouse/{warehouseId}")
    @Permission(code = "read", name = "查看数据权限")
    public Result<Boolean> checkWarehouseAccess(@PathVariable Long userId, @PathVariable Long warehouseId) {
        return Result.success(dataPermissionService.canAccessWarehouse(userId, warehouseId));
    }
}