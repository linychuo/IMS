package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.entity.SysConfig;
import com.ims.system.service.SysConfigService;
import com.ims.system.annotation.Permission;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 系统配置 Controller
 */
@RestController
@RequestMapping("/api/system/config")
@Permission(code = "system:config", name = "系统配置")
public class SysConfigController {

    @Autowired
    private SysConfigService sysConfigService;

    @GetMapping
    @Permission(code = "read", name = "查看配置")
    public Result<List<SysConfig>> list() {
        return Result.success(sysConfigService.listAll());
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看配置")
    public Result<SysConfig> getById(@PathVariable Long id) {
        return Result.success(sysConfigService.getById(id));
    }

    @GetMapping("/key/{key}")
    @Permission(code = "read", name = "查看配置")
    public Result<String> getValue(@PathVariable String key) {
        return Result.success(sysConfigService.getValue(key));
    }

    @GetMapping("/type/{configType}")
    @Permission(code = "read", name = "查看配置")
    public Result<List<SysConfig>> listByType(@PathVariable String configType) {
        return Result.success(sysConfigService.listByType(configType));
    }

    @GetMapping("/page")
    @Permission(code = "read", name = "查看配置")
    public Result<IPage<SysConfig>> page(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword) {
        return Result.success(sysConfigService.page(page, pageSize, keyword));
    }

    @PutMapping("/{id}/status")
    @Permission(code = "update", name = "更新配置")
    public Result<Boolean> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        return Result.success(sysConfigService.updateStatus(id, status));
    }

    @PostMapping
    @Permission(code = "create", name = "创建配置")
    public Result<Boolean> create(@RequestBody SysConfig config) {
        return Result.success(sysConfigService.create(config));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新配置")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody SysConfig config) {
        config.setId(id);
        return Result.success(sysConfigService.update(config));
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除配置")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(sysConfigService.delete(id));
    }
}