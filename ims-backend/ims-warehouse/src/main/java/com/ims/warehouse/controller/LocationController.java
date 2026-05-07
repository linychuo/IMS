package com.ims.warehouse.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.warehouse.entity.Location;
import com.ims.warehouse.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 库位Controller
 */
@RestController
@RequestMapping("/location")
public class LocationController {

    @Autowired
    private LocationService locationService;

    /**
     * 分页查询
     */
    @GetMapping("/page")
    public Result<PageResult<Location>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) Long warehouseId) {
        Page<Location> page = new Page<>(current, size);
        LambdaQueryWrapper<Location> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(warehouseId != null, Location::getWarehouseId, warehouseId)
                .orderByAsc(Location::getWarehouseId)
                .orderByAsc(Location::getRow)
                .orderByAsc(Location::getCol);
        IPage<Location> result = locationService.page(page, wrapper);
        return Result.ok(PageResult.build(result.getRecords(), result.getTotal(), current, size));
    }

    /**
     * 列表查询
     */
    @GetMapping("/list")
    public Result<?> list(@RequestParam(required = false) Long warehouseId) {
        LambdaQueryWrapper<Location> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(warehouseId != null, Location::getWarehouseId, warehouseId)
                .orderByAsc(Location::getRow)
                .orderByAsc(Location::getCol);
        return Result.ok(locationService.list(wrapper));
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public Result<Location> get(@PathVariable Long id) {
        Location location = locationService.getById(id);
        return location != null ? Result.ok(location) : Result.error("库位不存在");
    }

    /**
     * 新增
     */
    @PostMapping
    public Result<?> add(@RequestBody Location location) {
        locationService.save(location);
        return Result.ok();
    }

    /**
     * 修改
     */
    @PutMapping
    public Result<?> update(@RequestBody Location location) {
        locationService.updateById(location);
        return Result.ok();
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        locationService.removeById(id);
        return Result.ok();
    }
}