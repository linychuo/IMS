package com.ims.supplier.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.supplier.entity.Supplier;
import com.ims.supplier.service.SupplierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 供应商Controller
 */
@RestController
@RequestMapping("/supplier")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    /**
     * 分页查询
     */
    @GetMapping("/page")
    public Result<PageResult<Supplier>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword) {
        Page<Supplier> page = new Page<>(current, size);
        LambdaQueryWrapper<Supplier> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, Supplier::getName, keyword)
                .orderByDesc(Supplier::getCreateTime);
        IPage<Supplier> result = supplierService.page(page, wrapper);
        return Result.ok(PageResult.build(result.getRecords(), result.getTotal(), current, size));
    }

    /**
     * 列表查询
     */
    @GetMapping("/list")
    public Result<?> list(@RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<Supplier> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, Supplier::getName, keyword)
                .orderByDesc(Supplier::getCreateTime);
        return Result.ok(supplierService.list(wrapper));
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public Result<Supplier> get(@PathVariable Long id) {
        Supplier supplier = supplierService.getById(id);
        return supplier != null ? Result.ok(supplier) : Result.error("供应商不存在");
    }

    /**
     * 新增
     */
    @PostMapping
    public Result<?> add(@RequestBody Supplier supplier) {
        supplierService.save(supplier);
        return Result.ok();
    }

    /**
     * 修改
     */
    @PutMapping
    public Result<?> update(@RequestBody Supplier supplier) {
        supplierService.updateById(supplier);
        return Result.ok();
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        supplierService.removeById(id);
        return Result.ok();
    }
}