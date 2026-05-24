package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.entity.SysNotification;
import com.ims.system.service.SysNotificationService;
import com.ims.system.annotation.Permission;
import com.baomidou.mybatisplus.core.metadata.IPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 系统通知 Controller
 */
@RestController
@RequestMapping("/api/system/notification")
@Permission(code = "system:notification", name = "消息通知")
public class SysNotificationController {

    @Autowired
    private SysNotificationService notificationService;

    @GetMapping("/page")
    @Permission(code = "read", name = "查看通知")
    public Result<IPage<SysNotification>> page(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.success(notificationService.page(page, pageSize));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看通知")
    public Result<SysNotification> getById(@PathVariable Long id) {
        return Result.success(notificationService.getById(id));
    }

    @PostMapping
    @Permission(code = "create", name = "发送通知")
    public Result<Boolean> create(@RequestBody SysNotification notification) {
        return Result.success(notificationService.create(notification));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新通知")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody SysNotification notification) {
        notification.setId(id);
        return Result.success(notificationService.update(notification));
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除通知")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(notificationService.delete(id));
    }

    @PutMapping("/{id}/read")
    @Permission(code = "update", name = "标记已读")
    public Result<Boolean> markRead(@PathVariable Long id) {
        return Result.success(notificationService.markRead(id));
    }
}