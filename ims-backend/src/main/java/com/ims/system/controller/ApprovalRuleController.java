package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.entity.ApprovalRule;
import com.ims.system.service.ApprovalRuleService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 审批规则 Controller
 */
@RestController
@RequestMapping("/api/system/approval-rule")
@Permission(code = "system:approvalRule", name = "审批规则")
public class ApprovalRuleController {

    @Autowired
    private ApprovalRuleService approvalRuleService;

    @GetMapping
    @Permission(code = "read", name = "查看审批规则")
    public Result<List<ApprovalRule>> list() {
        return Result.success(approvalRuleService.listAll());
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看审批规则")
    public Result<ApprovalRule> getById(@PathVariable Long id) {
        return Result.success(approvalRuleService.getById(id));
    }

    @PostMapping
    @Permission(code = "create", name = "创建审批规则")
    public Result<Boolean> create(@RequestBody ApprovalRule rule) {
        return Result.success(approvalRuleService.create(rule));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新审批规则")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody ApprovalRule rule) {
        rule.setId(id);
        return Result.success(approvalRuleService.update(rule));
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除审批规则")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(approvalRuleService.delete(id));
    }

    @GetMapping("/check")
    @Permission(code = "read", name = "查看审批规则")
    public Result<Boolean> checkApproval(
            @RequestParam String businessType,
            @RequestParam BigDecimal amount) {
        return Result.success(approvalRuleService.requiresApproval(businessType, amount));
    }

    @GetMapping("/match")
    @Permission(code = "read", name = "查看审批规则")
    public Result<ApprovalRule> matchRule(
            @RequestParam String businessType,
            @RequestParam BigDecimal amount) {
        return Result.success(approvalRuleService.getRuleByAmount(businessType, amount));
    }
}