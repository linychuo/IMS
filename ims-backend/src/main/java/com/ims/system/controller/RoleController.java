package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.dto.RoleDTO;
import com.ims.system.entity.SysRole;
import com.ims.system.service.RoleService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 角色管理控制器
 */
@RestController
@RequestMapping("/role")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    /**
     * 根据用户ID获取角色列表
     */
    @GetMapping("/user/{userId}")
    public Result<List<RoleDTO>> getByUserId(@PathVariable Long userId) {
        List<RoleDTO> roles = roleService.getByUserId(userId);
        return Result.success(roles);
    }

    /**
     * 获取所有角色
     */
    @GetMapping("/list")
    public Result<List<RoleDTO>> listAll() {
        List<RoleDTO> roles = roleService.listAll();
        return Result.success(roles);
    }

    /**
     * 根据ID获取角色
     */
    @GetMapping("/{id}")
    public Result<RoleDTO> getById(@PathVariable Long id) {
        RoleDTO role = roleService.getById(id);
        if (role == null) {
            return Result.error("角色不存在");
        }
        return Result.success(role);
    }

    /**
     * 创建角色
     */
    @PostMapping
    public Result<RoleDTO> create(@RequestBody @Validated SysRole role) {
        RoleDTO result = roleService.create(role);
        return Result.success(result);
    }

    /**
     * 更新角色
     */
    @PutMapping
    public Result<RoleDTO> update(@RequestBody @Validated SysRole role) {
        RoleDTO result = roleService.update(role);
        return Result.success(result);
    }

    /**
     * 删除角色
     */
    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        roleService.delete(id);
        return Result.success(null);
    }

    /**
     * 分配权限
     */
    @PostMapping("/{id}/permissions")
    public Result<Void> assignPermissions(
            @PathVariable Long id,
            @RequestBody List<Long> permissionIds) {
        roleService.assignPermissions(id, permissionIds);
        return Result.success(null);
    }
}