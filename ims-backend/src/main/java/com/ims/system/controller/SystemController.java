package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.annotation.Permission;
import com.ims.system.dto.MenuTree;
import com.ims.system.entity.SysPermission;
import com.ims.system.service.PermissionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/system")
@Permission(code = "system", name = "系统管理")
public class SystemController {

    private final PermissionService permissionService;

    public SystemController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping("/permission/list")
    @Permission(code = "list", name = "查看权限")
    public Result<List<SysPermission>> listPermissions() {
        return Result.success(permissionService.listAll());
    }

    @GetMapping("/menu")
    @Permission(code = "list", name = "获取菜单")
    public Result<List<MenuTree>> getMenus(@RequestAttribute("X-User-Id") Long userId) {
        return Result.success(permissionService.getMenuTreeByUserId(userId));
    }

    @GetMapping("/permissions")
    @Permission(code = "list", name = "获取权限")
    public Result<List<String>> getPermissions(@RequestAttribute("X-User-Id") Long userId) {
        return Result.success(permissionService.getPermissionCodesByUserId(userId));
    }
}