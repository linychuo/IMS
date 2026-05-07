package com.ims.purchase.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.purchase.entity.PurchaseOrder;
import com.ims.purchase.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 采购订单Controller
 */
@RestController
@RequestMapping("/purchase/order")
public class PurchaseOrderController {

    @Autowired
    private PurchaseOrderService purchaseOrderService;

    /**
     * 分页查询
     */
    @GetMapping("/page")
    public Result<PageResult<PurchaseOrder>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Long supplierId) {
        Page<PurchaseOrder> page = new Page<>(current, size);
        LambdaQueryWrapper<PurchaseOrder> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, PurchaseOrder::getOrderNo, keyword)
                .eq(status != null, PurchaseOrder::getStatus, status)
                .eq(supplierId != null, PurchaseOrder::getSupplierId, supplierId)
                .orderByDesc(PurchaseOrder::getCreateTime);
        IPage<PurchaseOrder> result = purchaseOrderService.page(page, wrapper);
        return Result.ok(PageResult.build(result.getRecords(), result.getTotal(), current, size));
    }

    /**
     * 列表查询
     */
    @GetMapping("/list")
    public Result<?> list(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Long supplierId) {
        LambdaQueryWrapper<PurchaseOrder> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(status != null, PurchaseOrder::getStatus, status)
                .eq(supplierId != null, PurchaseOrder::getSupplierId, supplierId)
                .orderByDesc(PurchaseOrder::getCreateTime);
        return Result.ok(purchaseOrderService.list(wrapper));
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public Result<PurchaseOrder> get(@PathVariable Long id) {
        PurchaseOrder order = purchaseOrderService.getById(id);
        return order != null ? Result.ok(order) : Result.error("采购订单不存在");
    }

    /**
     * 新增
     */
    @PostMapping
    public Result<?> add(@RequestBody PurchaseOrder order) {
        order.setStatus(1); // 待确认
        purchaseOrderService.save(order);
        return Result.ok();
    }

    /**
     * 修改
     */
    @PutMapping
    public Result<?> update(@RequestBody PurchaseOrder order) {
        purchaseOrderService.updateById(order);
        return Result.ok();
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        purchaseOrderService.removeById(id);
        return Result.ok();
    }

    /**
     * 确认
     */
    @PostMapping("/confirm/{id}")
    public Result<?> confirm(@PathVariable Long id) {
        boolean success = purchaseOrderService.confirm(id);
        return success ? Result.ok() : Result.error("确认失败");
    }

    /**
     * 取消
     */
    @PostMapping("/cancel")
    public Result<?> cancel(@RequestParam Long id, @RequestParam String reason) {
        boolean success = purchaseOrderService.cancel(id, reason);
        return success ? Result.ok() : Result.error("取消失败");
    }

    /**
     * 完成
     */
    @PostMapping("/complete/{id}")
    public Result<?> complete(@PathVariable Long id) {
        boolean success = purchaseOrderService.complete(id);
        return success ? Result.ok() : Result.error("完成失败");
    }
}