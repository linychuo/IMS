package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.annotation.Permission;
import com.ims.system.dto.MenuDTO;
import com.ims.system.dto.MenuTree;
import com.ims.system.entity.SysPermission;
import com.ims.system.service.MenuService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 菜单管理控制器
 */
@RestController
@RequestMapping("/system/menu")
@Permission(code = "system:menu", name = "菜单管理")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    /**
     * 获取所有菜单(平铺)
     */
    @GetMapping("/list")
    @Permission(code = "list", name = "查看菜单")
    public Result<List<SysPermission>> listMenus() {
        return Result.success(menuService.listAllMenus());
    }

    /**
     * 获取菜单树
     */
    @GetMapping("/tree")
    @Permission(code = "tree", name = "菜单树")
    public Result<List<MenuTree>> getMenuTree() {
        return Result.success(menuService.getMenuTree());
    }

    /**
     * 获取单个菜单
     */
    @GetMapping("/{id}")
    @Permission(code = "get", name = "获取菜单")
    public Result<SysPermission> getMenu(@PathVariable Long id) {
        SysPermission menu = menuService.getMenuById(id);
        if (menu == null) {
            return Result.error("菜单不存在");
        }
        return Result.success(menu);
    }

    /**
     * 创建菜单
     */
    @PostMapping
    @Permission(code = "create", name = "创建菜单")
    public Result<Void> createMenu(@RequestBody MenuDTO dto) {
        menuService.createMenu(dto);
        return Result.success(null);
    }

    /**
     * 更新菜单
     */
    @PutMapping
    @Permission(code = "update", name = "更新菜单")
    public Result<Void> updateMenu(@RequestBody MenuDTO dto) {
        menuService.updateMenu(dto);
        return Result.success(null);
    }

    /**
     * 删除菜单
     */
    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除菜单")
    public Result<Void> deleteMenu(@PathVariable Long id) {
        menuService.deleteMenu(id);
        return Result.success(null);
    }

    /**
     * 更新菜单状态
     */
    @PutMapping("/{id}/status")
    @Permission(code = "status", name = "更新状态")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        menuService.updateMenuStatus(id, status);
        return Result.success(null);
    }
}