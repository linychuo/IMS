package com.ims.sales.controller;

import com.ims.core.result.Result;
import com.ims.sales.entity.SalesOut;
import com.ims.sales.entity.SalesOutDetail;
import com.ims.sales.service.SalesOutService;
import com.ims.system.annotation.Permission;
import com.ims.sales.dto.SalesOutRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 销售出库控制器
 */
@RestController
@RequestMapping("/api/sales/out")
@Permission(code = "sales:out", name = "销售出库")
public class SalesOutController {

    private static final Logger log = LoggerFactory.getLogger(SalesOutController.class);

    private final SalesOutService salesOutService;

    public SalesOutController(SalesOutService salesOutService) {
        this.salesOutService = salesOutService;
    }

    /**
     * 创建出库单
     */
    @PostMapping
    @Permission(code = "create", name = "创建销售出库")
    public Result<SalesOut> create(@RequestBody SalesOutRequest request) {
        return Result.success(salesOutService.create(request.getSalesOut(), request.getDetails()));
    }

    /**
     * 更新出库单
     */
    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新销售出库")
    public Result<SalesOut> update(@PathVariable Long id, @RequestBody SalesOutRequest request) {
        return Result.success(salesOutService.update(id, request.getSalesOut(), request.getDetails()));
    }

    /**
     * 审核出库单
     */
    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核销售出库")
    public Result<Void> approve(@PathVariable Long id, @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        String userIdStr = userId != null ? String.valueOf(userId) : "system";
        salesOutService.approve(id, userIdStr);
        return Result.success(null);
    }

    /**
     * 取消出库单
     */
    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消销售出库")
    public Result<Void> cancel(@PathVariable Long id, @RequestParam(required = false) String reason) {
        salesOutService.cancel(id, reason != null ? reason : "用户取消");
        return Result.success(null);
    }

    /**
     * 完成出库
     */
    @PostMapping("/{id}/complete")
    @Permission(code = "complete", name = "完成销售出库")
    public Result<Void> complete(@PathVariable Long id) {
        salesOutService.complete(id);
        return Result.success(null);
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看销售出库")
    public Result<SalesOut> getById(@PathVariable Long id) {
        return Result.success(salesOutService.getById(id));
    }

    /**
     * 根据单号查询
     */
    @GetMapping("/no/{outNo}")
    @Permission(code = "read", name = "查看销售出库")
    public Result<SalesOut> getByOutNo(@PathVariable String outNo) {
        return Result.success(salesOutService.getByOutNo(outNo));
    }

    /**
     * 查询明细
     */
    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看销售出库")
    public Result<List<SalesOutDetail>> getDetails(@PathVariable Long id) {
        return Result.success(salesOutService.getDetails(id));
    }

    /**
     * 查询列表
     */
    @GetMapping("/list")
    @Permission(code = "read", name = "查看销售出库")
    public Result<List<SalesOut>> list(@ModelAttribute SalesOut query) {
        return Result.success(salesOutService.list(query));
    }
}