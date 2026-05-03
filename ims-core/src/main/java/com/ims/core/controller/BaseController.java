package com.ims.core.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.List;

/**
 * 基础Controller
 * 提供通用的增删改查接口
 * @param <S> Service
 * @param <T> Entity
 */
public class BaseController<S, T> {

    /**
     * 获取Service
     */
    protected S getService() {
        return null;
    }

    /**
     * 获取 entity 类
     */
    protected Class<T> getEntityClass() {
        return null;
    }

    /**
     * 分页查询
     */
    @GetMapping("/page")
    public Result<PageResult<T>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            T entity) {
        Page<T> page = new Page<>(current, size);
        IPage<T> result = ((com.baomidou.mybatisplus.core.mapper.BaseMapper<T>) getService()).selectPage(page, null);
        return Result.ok(PageResult.build(result.getRecords(), result.getTotal(), current, size));
    }

    /**
     * 列表查询
     */
    @GetMapping("/list")
    public Result<List<T>> list(T entity) {
        return Result.ok(((com.baomidou.mybatisplus.core.mapper.BaseMapper<T>) getService()).selectList(null));
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public Result<T> get(@PathVariable Serializable id) {
        T entity = ((com.baomidou.mybatisplus.core.mapper.BaseMapper<T>) getService()).selectById(id);
        return entity != null ? Result.ok(entity) : Result.error("记录不存在");
    }

    /**
     * 新增
     */
    @PostMapping
    public Result<?> add(@RequestBody T entity) {
        ((com.baomidou.mybatisplus.core.mapper.BaseMapper<T>) getService()).insert(entity);
        return Result.ok();
    }

    /**
     * 修改
     */
    @PutMapping
    public Result<?> update(@RequestBody T entity) {
        ((com.baomidou.mybatisplus.core.mapper.BaseMapper<T>) getService()).updateById(entity);
        return Result.ok();
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Serializable id) {
        ((com.baomidou.mybatisplus.core.mapper.BaseMapper<T>) getService()).deleteById(id);
        return Result.ok();
    }
}