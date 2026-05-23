package com.ims.sales.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.sales.dto.SalesOrderRequest;
import com.ims.sales.entity.SalesOrder;
import com.ims.sales.entity.SalesOrderDetail;
import com.ims.sales.entity.SalesOrderStatusHistory;
import com.ims.sales.service.SalesOrderService;
import com.ims.system.annotation.Permission;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 销售订单控制器
 */
@RestController
@RequestMapping("/api/sales/order")
@Permission(code = "sales:order", name = "销售订单")
public class SalesOrderController {

    private static final Logger log = LoggerFactory.getLogger(SalesOrderController.class);

    private final SalesOrderService salesOrderService;

    public SalesOrderController(SalesOrderService salesOrderService) {
        this.salesOrderService = salesOrderService;
    }

    /**
     * 创建订单
     */
    @PostMapping
    @Permission(code = "create", name = "创建销售订单")
    public Result<SalesOrder> create(@RequestBody SalesOrderRequest request) {
        return Result.success(salesOrderService.create(request.getSalesOrder(), request.getDetails()));
    }

    /**
     * 更新订单
     */
    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新销售订单")
    public Result<SalesOrder> update(@PathVariable Long id,
                                              @RequestBody SalesOrderRequest request) {
        return Result.success(salesOrderService.update(id, request.getSalesOrder(), request.getDetails()));
    }

    /**
     * 审核订单
     */
    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核销售订单")
    public Result<Void> approve(@PathVariable Long id,
                                         @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        String userIdStr = userId != null ? String.valueOf(userId) : "system";
        salesOrderService.approve(id, userIdStr);
        return Result.success(null);
    }

    /**
     * 取消订单
     */
    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消销售订单")
    public Result<Void> cancel(@PathVariable Long id,
                                       @RequestParam(required = false) String reason) {
        salesOrderService.cancel(id, reason != null ? reason : "用户取消");
        return Result.success(null);
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看销售订单")
    public Result<SalesOrder> getById(@PathVariable Long id) {
        return Result.success(salesOrderService.getById(id));
    }

    /**
     * 根据订单号查询
     */
    @GetMapping("/no/{orderNo}")
    @Permission(code = "read", name = "查看销售订单")
    public Result<SalesOrder> getByOrderNo(@PathVariable String orderNo) {
        return Result.success(salesOrderService.getByOrderNo(orderNo));
    }

    /**
     * 查询订单明细
     */
    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看销售订单")
    public Result<List<SalesOrderDetail>> getDetails(@PathVariable Long id) {
        return Result.success(salesOrderService.getDetails(id));
    }

    /**
     * 查询列表
     */
    @GetMapping("/list")
    @Permission(code = "read", name = "查看销售订单")
    public Result<List<SalesOrder>> list(@ModelAttribute SalesOrder query) {
        return Result.success(salesOrderService.list(query));
    }

    /**
     * 分页查询
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看销售订单")
    public Result<PageResult<SalesOrder>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @ModelAttribute SalesOrder query) {
        return Result.success(salesOrderService.page(current, size, query));
    }

    /**
     * 查询订单状态历史
     */
    @GetMapping("/{id}/status-history")
    @Permission(code = "read", name = "查看销售订单")
    public Result<List<SalesOrderStatusHistory>> getStatusHistory(@PathVariable Long id) {
        return Result.success(salesOrderService.getStatusHistory(id));
    }
}