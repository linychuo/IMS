package com.ims.system.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.system.entity.SysOperationLog;
import com.ims.system.service.SysOperationLogService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 操作日志 Controller
 */
@RestController
@RequestMapping("/api/system/log")
@Permission(code = "system:log", name = "操作日志")
public class SysOperationLogController {

    @Autowired
    private SysOperationLogService operationLogService;

    @GetMapping("/page")
    @Permission(code = "read", name = "查看日志")
    public Result<PageResult<SysOperationLog>> page(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer pageSize,
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String operator,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime) {
        List<SysOperationLog> list = operationLogService.page(page, pageSize, module, operator, startTime, endTime);
        long total = operationLogService.count(module, startTime, endTime);
        return Result.success(new PageResult<>(list, total, (long) page, (long) pageSize));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看日志")
    public Result<SysOperationLog> getById(@PathVariable Long id) {
        return Result.success(operationLogService.getById(id));
    }

    @GetMapping("/stats")
    @Permission(code = "read", name = "查看日志")
    public Result<Map<String, Object>> getStats(
            @RequestParam(required = false) String module,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", operationLogService.count(module, startTime, endTime));
        return Result.success(stats);
    }
}