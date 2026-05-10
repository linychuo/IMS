package com.ims.warehouse.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.warehouse.entity.Warehouse;
import com.ims.warehouse.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 仓库Controller
 */
@RestController
@RequestMapping("/api/warehouse")
public class WarehouseController {

    @Autowired
    private WarehouseService warehouseService;

    /**
     * 分页查询
     */
    @GetMapping("/page")
    public Result<PageResult<Warehouse>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword) {
        Page<Warehouse> page = new Page<>(current, size);
        LambdaQueryWrapper<Warehouse> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, Warehouse::getName, keyword)
                .orderByDesc(Warehouse::getCreateTime);
        IPage<Warehouse> result = warehouseService.page(page, wrapper);
        return Result.ok(PageResult.build(result.getRecords(), result.getTotal(), current, size));
    }

    /**
     * 列表查询
     */
    @GetMapping("/list")
    public Result<?> list(@RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<Warehouse> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, Warehouse::getName, keyword)
                .orderByDesc(Warehouse::getCreateTime);
        return Result.ok(warehouseService.list(wrapper));
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public Result<Warehouse> get(@PathVariable Long id) {
        Warehouse warehouse = warehouseService.getById(id);
        return warehouse != null ? Result.ok(warehouse) : Result.error("仓库不存在");
    }

    /**
     * 新增
     */
    @PostMapping
    public Result<?> add(@RequestBody Warehouse warehouse) {
        warehouseService.save(warehouse);
        return Result.ok();
    }

    /**
     * 修改
     */
    @PutMapping
    public Result<?> update(@RequestBody Warehouse warehouse) {
        warehouseService.updateById(warehouse);
        return Result.ok();
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        warehouseService.removeById(id);
        return Result.ok();
    }
}