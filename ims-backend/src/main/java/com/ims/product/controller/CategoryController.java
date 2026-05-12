package com.ims.product.controller;

import com.ims.core.result.Result;
import com.ims.product.entity.Category;
import com.ims.product.service.CategoryService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@Permission(code = "product:category", name = "商品分类")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/list")
    @Permission(code = "list", name = "查看分类")
    public Result<List<Category>> list() {
        return Result.success(categoryService.list());
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看分类")
    public Result<Category> getById(@PathVariable Long id) {
        return Result.success(categoryService.getById(id));
    }

    @PostMapping
    @Permission(code = "create", name = "创建分类")
    public Result<Category> create(@RequestBody Category category) {
        return Result.success(categoryService.create(category));
    }

    @PutMapping
    @Permission(code = "update", name = "更新分类")
    public Result<Category> update(@RequestBody Category category) {
        return Result.success(categoryService.update(category));
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除分类")
    public Result<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return Result.success(null);
    }
}