package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.dto.UserDTO;
import com.ims.system.entity.SysUser;
import com.ims.system.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户管理控制器
 */
@RestController
@RequestMapping("/user")
@Tag(name = "用户管理")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/info")
    @Operation(summary = "获取当前用户信息")
    public Result<UserDTO> getCurrentUser(@RequestHeader("X-User-Id") Long userId) {
        UserDTO user = userService.getById(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        return Result.success(user);
    }

    /**
     * 根据ID获取用户
     */
    @GetMapping("/{id}")
    @Operation(summary = "根据ID获取用户")
    public Result<UserDTO> getById(@PathVariable Long id) {
        UserDTO user = userService.getById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }
        return Result.success(user);
    }

    /**
     * 获取所有用户
     */
    @GetMapping("/list")
    @Operation(summary = "获取所有用户")
    public Result<List<UserDTO>> listAll() {
        List<UserDTO> users = userService.listAll();
        return Result.success(users);
    }

    /**
     * 创建用户
     */
    @PostMapping
    @Operation(summary = "创建用户")
    public Result<UserDTO> create(@RequestBody @Validated SysUser user) {
        UserDTO result = userService.create(user);
        return Result.success(result);
    }

    /**
     * 更新用户
     */
    @PutMapping
    @Operation(summary = "更新用户")
    public Result<UserDTO> update(@RequestBody @Validated SysUser user) {
        UserDTO result = userService.update(user);
        return Result.success(result);
    }

    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户")
    public Result<Void> delete(@PathVariable Long id) {
        userService.delete(id);
        return Result.success(null);
    }

    /**
     * 修改密码
     */
    @PostMapping("/password")
    @Operation(summary = "修改密码")
    public Result<Void> changePassword(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody ChangePasswordRequest request) {
        userService.changePassword(userId, request.getOldPassword(), request.getNewPassword());
        return Result.success(null);
    }

    /**
     * 重置密码
     */
    @PostMapping("/password/reset/{id}")
    @Operation(summary = "重置密码")
    public Result<Void> resetPassword(@PathVariable Long id) {
        userService.resetPassword(id, "123456");
        return Result.success(null);
    }

    /**
     * 修改密码请求
     */
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;

        public String getOldPassword() {
            return oldPassword;
        }

        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}