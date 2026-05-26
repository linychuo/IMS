package com.ims.inventory.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.inventory.entity.QualityCheck;
import com.ims.inventory.entity.QualityCheckDetail;
import com.ims.inventory.service.QualityCheckService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 质检单控制器
 */
@RestController
@RequestMapping("/api/inventory/quality-check")
@Permission(code = "inventory:quality-check", name = "质检管理")
public class QualityCheckController {

    @Autowired
    private QualityCheckService qualityCheckService;

    @GetMapping("/page")
    @Permission(code = "read", name = "查看质检单")
    public Result<PageResult<QualityCheck>> page(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long pageSize,
            @RequestParam(required = false) String orderType,
            @RequestParam(required = false) Integer status) {
        return Result.success(qualityCheckService.page(page, pageSize, orderType, status));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看质检单")
    public Result<QualityCheck> getById(@PathVariable Long id) {
        return Result.success(qualityCheckService.getById(id));
    }

    @PostMapping
    @Permission(code = "create", name = "创建质检单")
    public Result<QualityCheck> create(@RequestBody QualityCheckRequest request) {
        return Result.success(qualityCheckService.create(request.getCheck(), request.getDetails()));
    }

    @PutMapping("/{id}/result")
    @Permission(code = "update", name = "更新质检结果")
    public Result<Boolean> updateResult(
            @PathVariable Long id,
            @RequestParam String checkResult,
            @RequestParam BigDecimal qualifiedQty,
            @RequestParam BigDecimal unqualifiedQty,
            @RequestParam(required = false) String remark) {
        return Result.success(qualityCheckService.updateResult(id, checkResult, qualifiedQty, unqualifiedQty, remark));
    }

    @PutMapping("/{id}/submit")
    @Permission(code = "submit", name = "提交质检结果")
    public Result<Boolean> submit(
            @PathVariable Long id,
            @RequestParam Long inspectorId,
            @RequestParam String inspectorName) {
        return Result.success(qualityCheckService.submit(id, inspectorId, inspectorName));
    }

    @PutMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消质检")
    public Result<Boolean> cancel(@PathVariable Long id, @RequestParam String reason) {
        return Result.success(qualityCheckService.cancel(id, reason));
    }

    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看质检单")
    public Result<List<QualityCheckDetail>> getDetails(@PathVariable Long id) {
        return Result.success(qualityCheckService.getDetails(id));
    }

    public static class QualityCheckRequest {
        private QualityCheck check;
        private List<QualityCheckDetail> details;

        public QualityCheck getCheck() { return check; }
        public void setCheck(QualityCheck check) { this.check = check; }
        public List<QualityCheckDetail> getDetails() { return details; }
        public void setDetails(List<QualityCheckDetail> details) { this.details = details; }
    }
}