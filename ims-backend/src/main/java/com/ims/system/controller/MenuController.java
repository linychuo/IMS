package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.annotation.Permission;
import com.ims.system.dto.MenuDTO;
import com.ims.system.dto.MenuTree;
import com.ims.system.entity.SysMenu;
import com.ims.system.entity.SysPermission;
import com.ims.system.service.MenuService;
import com.ims.system.service.PermissionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 栏目管理控制器
 * 栏目数据手工维护，每个栏目关联权限点
 */
@RestController
@RequestMapping("/system/menu")
@Permission(code = "system:menu", name = "栏目管理")
public class MenuController {

    private final MenuService menuService;
    private final PermissionService permissionService;

    public MenuController(MenuService menuService, PermissionService permissionService) {
        this.menuService = menuService;
        this.permissionService = permissionService;
    }

    /**
     * 获取栏目树（用于前端菜单渲染）
     */
    @GetMapping("/tree")
    @Permission(code = "tree", name = "栏目树")
    public Result<List<MenuTree>> getMenuTree() {
        return Result.success(menuService.getMenuTree());
    }

    /**
     * 获取栏目列表（平铺，用于管理界面）
     */
    @GetMapping("/list")
    @Permission(code = "list", name = "查看栏目")
    public Result<List<SysMenu>> listMenus() {
        return Result.success(menuService.listAllMenus());
    }

    /**
     * 获取单个栏目
     */
    @GetMapping("/{id}")
    @Permission(code = "get", name = "获取栏目")
    public Result<SysMenu> getMenu(@PathVariable Long id) {
        SysMenu menu = menuService.getMenuById(id);
        if (menu == null) {
            return Result.error("栏目不存在");
        }
        return Result.success(menu);
    }

    /**
     * 创建栏目
     */
    @PostMapping
    @Permission(code = "create", name = "创建栏目")
    public Result<Void> createMenu(@RequestBody MenuDTO dto) {
        menuService.createMenu(dto);
        return Result.success(null);
    }

    /**
     * 更新栏目
     */
    @PutMapping
    @Permission(code = "update", name = "更新栏目")
    public Result<Void> updateMenu(@RequestBody MenuDTO dto) {
        menuService.updateMenu(dto);
        return Result.success(null);
    }

    /**
     * 删除栏目
     */
    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除栏目")
    public Result<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return Result.success(null);
    }

    /**
     * 更新栏目状态
     */
    @PutMapping("/{id}/status")
    @Permission(code = "status", name = "更新状态")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        menuService.updateMenuStatus(id, status);
        return Result.success(null);
    }

    /**
     * 获取栏目的权限点列表
     */
    @GetMapping("/{id}/permissions")
    @Permission(code = "permissions", name = "栏目权限")
    public Result<List<SysPermission>> getMenuPermissions(@PathVariable Long id) {
        return Result.success(menuService.getMenuPermissions(id));
    }

    /**
     * 更新栏目的权限点
     */
    @PutMapping("/{id}/permissions")
    @Permission(code = "permissions", name = "更新栏目权限")
    public Result<Void> updateMenuPermissions(@PathVariable Long id, @RequestBody List<Long> permissionIds) {
        menuService.updateMenuPermissions(id, permissionIds);
        return Result.success(null);
    }

    /**
     * 获取所有可用权限点（用于分配给栏目）
     * 这些权限点是 PermissionScanner 扫描代码得到的
     */
    @GetMapping("/permission-options")
    @Permission(code = "permissionOptions", name = "权限点列表")
    public Result<List<SysPermission>> getPermissionOptions() {
        return Result.success(permissionService.listAll());
    }
}