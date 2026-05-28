package com.ims.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.system.entity.BackupRecord;
import com.ims.system.service.BackupService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * 备份恢复Controller
 */
@RestController
@RequestMapping("/api/backup")
@Permission(code = "system:backup", name = "备份恢复")
public class BackupController {

    @Autowired
    private BackupService backupService;

    @GetMapping("/page")
    @Permission(code = "read", name = "查看备份")
    public Result<PageResult<BackupRecord>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String backupType) {
        Page<BackupRecord> page = new Page<>(current, size);
        LambdaQueryWrapper<BackupRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, BackupRecord::getBackupName, keyword)
                .eq(backupType != null, BackupRecord::getBackupType, backupType)
                .orderByDesc(BackupRecord::getCreateTime);
        var result = backupService.page(page, wrapper);
        return Result.ok(PageResult.build(result.getRecords(), result.getTotal(), current, size));
    }

    @GetMapping("/list")
    @Permission(code = "read", name = "查看备份")
    public Result<?> list() {
        return Result.ok(backupService.list(
            new LambdaQueryWrapper<BackupRecord>()
                .orderByDesc(BackupRecord::getCreateTime)
                .last("LIMIT 100")
        ));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看备份")
    public Result<BackupRecord> get(@PathVariable Long id) {
        BackupRecord record = backupService.getById(id);
        return record != null ? Result.ok(record) : Result.error("备份记录不存在");
    }

    @PostMapping("/full")
    @Permission(code = "create", name = "创建备份")
    public Result<Map<String, Object>> fullBackup(@RequestBody(required = false) Map<String, String> params) {
        String backupName = params != null && params.containsKey("backupName")
            ? params.get("backupName")
            : "全量备份_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

        BackupRecord record = backupService.fullBackup(backupName);
        Map<String, Object> result = new HashMap<>();
        result.put("id", record.getId());
        result.put("status", record.getStatus());
        result.put("message", "备份任务已启动");
        return Result.ok(result);
    }

    @PostMapping("/incremental")
    @Permission(code = "create", name = "创建备份")
    public Result<Map<String, Object>> incrementalBackup(@RequestBody(required = false) Map<String, String> params) {
        String backupName = params != null && params.containsKey("backupName")
            ? params.get("backupName")
            : "增量备份_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

        BackupRecord record = backupService.incrementalBackup(backupName);
        Map<String, Object> result = new HashMap<>();
        result.put("id", record.getId());
        result.put("status", record.getStatus());
        result.put("message", "备份任务已启动");
        return Result.ok(result);
    }

    @PostMapping("/restore/{id}")
    @Permission(code = "update", name = "恢复备份")
    public Result<?> restore(@PathVariable Long id) {
        try {
            backupService.restore(id);
            return Result.ok("恢复成功");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除备份")
    public Result<?> delete(@PathVariable Long id) {
        backupService.deleteBackup(id);
        return Result.ok();
    }
}
