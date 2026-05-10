package com.ims.warehouse.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.warehouse.entity.Warehouse;
import com.ims.warehouse.service.WarehouseService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warehouse")
@Permission(code = "warehouse:warehouse", name = "仓库管理")
public class WarehouseController {

    @Autowired
    private WarehouseService warehouseService;

    @GetMapping("/page")
    @Permission(code = "list", name = "查看仓库")
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

    @GetMapping("/list")
    @Permission(code = "list", name = "查看仓库")
    public Result<?> list(@RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<Warehouse> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, Warehouse::getName, keyword)
                .orderByDesc(Warehouse::getCreateTime);
        return Result.ok(warehouseService.list(wrapper));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看仓库")
    public Result<Warehouse> get(@PathVariable Long id) {
        Warehouse warehouse = warehouseService.getById(id);
        return warehouse != null ? Result.ok(warehouse) : Result.error("仓库不存在");
    }

    @PostMapping
    @Permission(code = "create", name = "创建仓库")
    public Result<?> add(@RequestBody Warehouse warehouse) {
        warehouseService.save(warehouse);
        return Result.ok();
    }

    @PutMapping
    @Permission(code = "update", name = "更新仓库")
    public Result<?> update(@RequestBody Warehouse warehouse) {
        warehouseService.updateById(warehouse);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除仓库")
    public Result<?> delete(@PathVariable Long id) {
        warehouseService.removeById(id);
        return Result.ok();
    }
}