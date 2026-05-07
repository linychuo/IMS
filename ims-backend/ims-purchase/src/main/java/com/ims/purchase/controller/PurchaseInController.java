package com.ims.purchase.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.purchase.entity.PurchaseIn;
import com.ims.purchase.service.PurchaseInService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 采购入库Controller
 */
@RestController
@RequestMapping("/purchase/in")
public class PurchaseInController {

    @Autowired
    private PurchaseInService purchaseInService;

    /**
     * 分页查询
     */
    @GetMapping("/page")
    public Result<PageResult<PurchaseIn>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Long orderId,
            @RequestParam(required = false) Long supplierId) {
        Page<PurchaseIn> page = new Page<>(current, size);
        LambdaQueryWrapper<PurchaseIn> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, PurchaseIn::getInNo, keyword)
                .eq(status != null, PurchaseIn::getStatus, status)
                .eq(orderId != null, PurchaseIn::getOrderId, orderId)
                .eq(supplierId != null, PurchaseIn::getSupplierId, supplierId)
                .orderByDesc(PurchaseIn::getCreateTime);
        IPage<PurchaseIn> result = purchaseInService.page(page, wrapper);
        return Result.ok(PageResult.build(result.getRecords(), result.getTotal(), current, size));
    }

    /**
     * 列表查询
     */
    @GetMapping("/list")
    public Result<?> list(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Long orderId) {
        LambdaQueryWrapper<PurchaseIn> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(status != null, PurchaseIn::getStatus, status)
                .eq(orderId != null, PurchaseIn::getOrderId, orderId)
                .orderByDesc(PurchaseIn::getCreateTime);
        return Result.ok(purchaseInService.list(wrapper));
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public Result<PurchaseIn> get(@PathVariable Long id) {
        PurchaseIn purchaseIn = purchaseInService.getById(id);
        return purchaseIn != null ? Result.ok(purchaseIn) : Result.error("入库单不存在");
    }

    /**
     * 新增
     */
    @PostMapping
    public Result<?> add(@RequestBody PurchaseIn purchaseIn) {
        purchaseIn.setStatus(1); // 待入库
        purchaseInService.save(purchaseIn);
        return Result.ok();
    }

    /**
     * 修改
     */
    @PutMapping
    public Result<?> update(@RequestBody PurchaseIn purchaseIn) {
        purchaseInService.updateById(purchaseIn);
        return Result.ok();
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        purchaseInService.removeById(id);
        return Result.ok();
    }

    /**
     * 审核入库（入库）
     */
    @PostMapping("/audit/{id}")
    public Result<?> auditIn(@PathVariable Long id, @RequestParam String operator) {
        boolean success = purchaseInService.auditIn(id, operator);
        return success ? Result.ok() : Result.error("入库失败");
    }

    /**
     * 取消
     */
    @PostMapping("/cancel")
    public Result<?> cancel(@RequestParam Long id, @RequestParam String reason) {
        boolean success = purchaseInService.cancel(id, reason);
        return success ? Result.ok() : Result.error("取消失败");
    }
}