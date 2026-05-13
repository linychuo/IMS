package com.ims.sales.controller;

import com.ims.core.result.Result;
import com.ims.sales.entity.SalesReturn;
import com.ims.sales.entity.SalesReturnDetail;
import com.ims.sales.service.SalesReturnService;
import com.ims.sales.dto.SalesReturnRequest;
import com.ims.system.annotation.Permission;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 销售退货控制器
 */
@RestController
@RequestMapping("/api/sales/return")
@Permission(code = "sales:return", name = "销售退货")
public class SalesReturnController {

    private static final Logger log = LoggerFactory.getLogger(SalesReturnController.class);
    private final SalesReturnService salesReturnService;

    public SalesReturnController(SalesReturnService salesReturnService) {
        this.salesReturnService = salesReturnService;
    }

    @PostMapping
    @Permission(code = "create", name = "创建销售退货")
    public Result<SalesReturn> create(@RequestBody SalesReturnRequest request) {
        return Result.success(salesReturnService.create(request.getSalesReturn(), request.getDetails()));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新销售退货")
    public Result<SalesReturn> update(@PathVariable Long id, @RequestBody SalesReturnRequest request) {
        return Result.success(salesReturnService.update(id, request.getSalesReturn(), request.getDetails()));
    }

    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核销售退货")
    public Result<Void> approve(@PathVariable Long id, @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        String userIdStr = userId != null ? String.valueOf(userId) : "system";
        salesReturnService.approve(id, userIdStr);
        return Result.success(null);
    }

    @PostMapping("/{id}/reject")
    @Permission(code = "reject", name = "拒绝销售退货")
    public Result<Void> reject(@PathVariable Long id, @RequestParam(required = false) String reason) {
        salesReturnService.reject(id, reason != null ? reason : "不符要求");
        return Result.success(null);
    }

    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消销售退货")
    public Result<Void> cancel(@PathVariable Long id, @RequestParam(required = false) String reason) {
        salesReturnService.cancel(id, reason != null ? reason : "用户取消");
        return Result.success(null);
    }

    @PostMapping("/{id}/inbound")
    @Permission(code = "inbound", name = "销售退货入库")
    public Result<Void> inbound(@PathVariable Long id, @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        String userIdStr = userId != null ? String.valueOf(userId) : "system";
        salesReturnService.inbound(id, userIdStr);
        return Result.success(null);
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看销售退货")
    public Result<SalesReturn> getById(@PathVariable Long id) {
        return Result.success(salesReturnService.getById(id));
    }

    @GetMapping("/no/{returnNo}")
    @Permission(code = "read", name = "查看销售退货")
    public Result<SalesReturn> getByReturnNo(@PathVariable String returnNo) {
        return Result.success(salesReturnService.getByReturnNo(returnNo));
    }

    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看销售退货")
    public Result<List<SalesReturnDetail>> getDetails(@PathVariable Long id) {
        return Result.success(salesReturnService.getDetails(id));
    }

    @GetMapping("/list")
    @Permission(code = "read", name = "查看销售退货")
    public Result<List<SalesReturn>> list(@ModelAttribute SalesReturn query) {
        return Result.success(salesReturnService.list(query));
    }
}