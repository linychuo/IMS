package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.annotation.Permission;
import com.ims.system.dto.RoleDTO;
import com.ims.system.entity.SysRole;
import com.ims.system.service.RoleService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/role")
@Permission(code = "role", name = "系统管理")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping("/user/{userId}")
    @Permission(code = "list", name = "查看角色")
    public Result<List<RoleDTO>> getByUserId(@PathVariable Long userId) {
        return Result.success(roleService.getByUserId(userId));
    }

    @GetMapping("/list")
    @Permission(code = "list", name = "查看角色列表")
    public Result<List<RoleDTO>> listAll() {
        return Result.success(roleService.listAll());
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看角色")
    public Result<RoleDTO> getById(@PathVariable Long id) {
        RoleDTO role = roleService.getById(id);
        return role == null ? Result.error("角色不存在") : Result.success(role);
    }

    @PostMapping
    @Permission(code = "create", name = "创建角色")
    public Result<RoleDTO> create(@RequestBody @Validated SysRole role) {
        return Result.success(roleService.create(role));
    }

    @PutMapping
    @Permission(code = "update", name = "更新角色")
    public Result<RoleDTO> update(@RequestBody @Validated SysRole role) {
        return Result.success(roleService.update(role));
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除角色")
    public Result<Void> delete(@PathVariable Long id) {
        if (id == 1) {
            return Result.error("禁止删除管理员角色");
        }
        roleService.delete(id);
        return Result.success(null);
    }

    @PostMapping("/{id}/permissions")
    @Permission(code = "assign", name = "分配权限")
    public Result<Void> assignPermissions(@PathVariable Long id, @RequestBody List<Long> permissionIds) {
        roleService.assignPermissions(id, permissionIds);
        return Result.success(null);
    }

    @GetMapping("/{id}/permissions")
    @Permission(code = "list", name = "查看角色权限")
    public Result<List<Long>> getPermissions(@PathVariable Long id) {
        return Result.success(roleService.getPermissionIds(id));
    }
}