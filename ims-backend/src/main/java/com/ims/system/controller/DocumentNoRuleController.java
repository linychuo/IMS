package com.ims.system.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.system.entity.DocumentNoRule;
import com.ims.system.service.DocumentNoRuleService;
import com.ims.system.service.impl.DocumentNoRuleServiceImpl;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 单据编号规则Controller
 */
@RestController
@RequestMapping("/api/document-no-rule")
@Permission(code = "system:documentNoRule", name = "单据编号规则")
public class DocumentNoRuleController {

    @Autowired
    private DocumentNoRuleService documentNoRuleService;

    @GetMapping("/page")
    @Permission(code = "read", name = "查看规则")
    public Result<PageResult<DocumentNoRule>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword) {
        Page<DocumentNoRule> page = new Page<>(current, size);
        LambdaQueryWrapper<DocumentNoRule> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, DocumentNoRule::getBizName, keyword)
                .orderByAsc(DocumentNoRule::getBizType);
        var result = documentNoRuleService.page(page, wrapper);
        return Result.ok(PageResult.build(result.getRecords(), result.getTotal(), current, size));
    }

    @GetMapping("/list")
    @Permission(code = "read", name = "查看规则")
    public Result<?> list() {
        return Result.ok(documentNoRuleService.list());
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看规则")
    public Result<DocumentNoRule> get(@PathVariable Long id) {
        DocumentNoRule rule = documentNoRuleService.getById(id);
        return rule != null ? Result.ok(rule) : Result.error("规则不存在");
    }

    @PostMapping
    @Permission(code = "create", name = "创建规则")
    public Result<?> add(@RequestBody DocumentNoRule rule) {
        documentNoRuleService.save(rule);
        return Result.ok();
    }

    @PutMapping
    @Permission(code = "update", name = "更新规则")
    public Result<?> update(@RequestBody DocumentNoRule rule) {
        documentNoRuleService.updateById(rule);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除规则")
    public Result<?> delete(@PathVariable Long id) {
        documentNoRuleService.removeById(id);
        return Result.ok();
    }

    @PostMapping("/init")
    @Permission(code = "update", name = "初始化规则")
    public Result<?> initDefaults() {
        var defaultRules = ((DocumentNoRuleServiceImpl) documentNoRuleService).getDefaultRules();
        documentNoRuleService.saveBatch(defaultRules);
        return Result.ok();
    }
}
