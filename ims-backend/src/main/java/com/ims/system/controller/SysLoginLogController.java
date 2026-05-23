package com.ims.system.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.system.entity.SysLoginLog;
import com.ims.system.service.SysLoginLogService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 登录日志 Controller
 */
@RestController
@RequestMapping("/api/system/login-log")
@Permission(code = "system:loginLog", name = "登录日志")
public class SysLoginLogController {

    @Autowired
    private SysLoginLogService loginLogService;

    @GetMapping("/page")
    @Permission(code = "read", name = "查看登录日志")
    public Result<PageResult<SysLoginLog>> page(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime) {
        List<SysLoginLog> list = loginLogService.page(page, pageSize, username, startTime, endTime);
        long total = loginLogService.countByUsername(username);
        return Result.success(new PageResult<>(list, total, (long) page, (long) pageSize));
    }
}