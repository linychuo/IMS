package com.ims.system.controller;

import cn.hutool.core.util.RandomUtil;
import com.ims.core.result.Result;
import com.ims.system.annotation.Permission;
import com.ims.system.dto.UserDTO;
import com.ims.system.entity.SysUser;
import com.ims.system.service.UserService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户管理控制器
 */
@RestController
@RequestMapping("/user")
@Permission(code = "system:user", name = "用户管理")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/info")
    @Permission(code = "info", name = "查看用户信息")
    public Result<UserDTO> getCurrentUser(@RequestHeader("X-User-Id") Long userId) {
        UserDTO user = userService.getById(userId);
        return user == null ? Result.error("用户不存在") : Result.success(user);
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看用户")
    public Result<UserDTO> getById(@PathVariable Long id) {
        UserDTO user = userService.getById(id);
        return user == null ? Result.error("用户不存在") : Result.success(user);
    }

    @GetMapping("/list")
    @Permission(code = "list", name = "查看用户列表")
    public Result<List<UserDTO>> listAll() {
        return Result.success(userService.listAll());
    }

    @PostMapping
    @Permission(code = "create", name = "创建用户")
    public Result<UserDTO> create(@RequestBody @Validated SysUser user) {
        return Result.success(userService.create(user));
    }

    @PutMapping
    @Permission(code = "update", name = "更新用户")
    public Result<UserDTO> update(@RequestBody @Validated SysUser user) {
        return Result.success(userService.update(user));
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除用户")
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success(null);
    }

    @PostMapping("/password")
    @Permission(code = "password", name = "修改密码")
    public Result<Void> changePassword(@RequestHeader("X-User-Id") Long userId, @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userId, request.getOldPassword(), request.getNewPassword());
        return Result.success(null);
    }

    @PostMapping("/password/reset/{id}")
    @Permission(code = "resetPassword", name = "重置密码")
    public Result<Void> resetPassword(@PathVariable Long id) {
        // 生成随机8位密码
        String newPassword = RandomUtil.randomString(8);
        userService.resetPassword(id, newPassword);
        return Result.success(null);
    }

    @PostMapping("/{id}/role")
    @Permission(code = "assignRole", name = "分配角色")
    public Result<Void> assignRole(@PathVariable Long id, @RequestBody AssignRoleRequest request) {
        userService.assignRole(id, request.getRoleId());
        return Result.success(null);
    }

    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
        public String getOldPassword() { return oldPassword; }
        public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class AssignRoleRequest {
        private Long roleId;
        public Long getRoleId() { return roleId; }
        public void setRoleId(Long roleId) { this.roleId = roleId; }
    }
}