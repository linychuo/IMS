package com.ims.product.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.product.entity.UnitOfMeasure;
import com.ims.product.service.UnitOfMeasureService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 计量单位Controller
 */
@RestController
@RequestMapping("/api/unit-of-measure")
@Permission(code = "product:unitOfMeasure", name = "计量单位管理")
public class UnitOfMeasureController {

    @Autowired
    private UnitOfMeasureService unitOfMeasureService;

    @GetMapping("/page")
    @Permission(code = "read", name = "查看计量单位")
    public Result<PageResult<UnitOfMeasure>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer type) {
        Page<UnitOfMeasure> page = new Page<>(current, size);
        LambdaQueryWrapper<UnitOfMeasure> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, UnitOfMeasure::getName, keyword)
                .eq(type != null, UnitOfMeasure::getType, type)
                .orderByDesc(UnitOfMeasure::getCreateTime);
        IPage<UnitOfMeasure> result = unitOfMeasureService.page(page, wrapper);
        return Result.ok(PageResult.build(result.getRecords(), result.getTotal(), current, size));
    }

    @GetMapping("/list")
    @Permission(code = "read", name = "查看计量单位")
    public Result<?> list(@RequestParam(required = false) Integer type) {
        LambdaQueryWrapper<UnitOfMeasure> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(type != null, UnitOfMeasure::getType, type)
                .eq(UnitOfMeasure::getStatus, 1)
                .orderByAsc(UnitOfMeasure::getType, UnitOfMeasure::getCode);
        return Result.ok(unitOfMeasureService.list(wrapper));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看计量单位")
    public Result<UnitOfMeasure> get(@PathVariable Long id) {
        UnitOfMeasure unit = unitOfMeasureService.getById(id);
        return unit != null ? Result.ok(unit) : Result.error("计量单位不存在");
    }

    @PostMapping
    @Permission(code = "create", name = "创建计量单位")
    public Result<?> add(@RequestBody UnitOfMeasure unitOfMeasure) {
        unitOfMeasureService.save(unitOfMeasure);
        return Result.ok();
    }

    @PutMapping
    @Permission(code = "update", name = "更新计量单位")
    public Result<?> update(@RequestBody UnitOfMeasure unitOfMeasure) {
        unitOfMeasureService.updateById(unitOfMeasure);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除计量单位")
    public Result<?> delete(@PathVariable Long id) {
        unitOfMeasureService.removeById(id);
        return Result.ok();
    }
}
