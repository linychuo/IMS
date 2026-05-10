package com.ims.product.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.product.entity.Product;
import com.ims.product.service.ProductService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product")
@Permission(code = "product:product", name = "商品管理")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/page")
    @Permission(code = "read", name = "查看商品")
    public Result<PageResult<Product>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId) {
        Page<Product> page = new Page<>(current, size);
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, Product::getName, keyword)
                .eq(categoryId != null, Product::getCategoryId, categoryId)
                .orderByDesc(Product::getCreateTime);
        IPage<Product> result = productService.page(page, wrapper);
        return Result.ok(PageResult.build(result.getRecords(), result.getTotal(), current, size));
    }

    @GetMapping("/list")
    @Permission(code = "read", name = "查看商品")
    public Result<?> list(@RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, Product::getName, keyword)
                .orderByDesc(Product::getCreateTime);
        return Result.ok(productService.list(wrapper));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看商品")
    public Result<Product> get(@PathVariable Long id) {
        Product product = productService.getById(id);
        return product != null ? Result.ok(product) : Result.error("商品不存在");
    }

    @PostMapping
    @Permission(code = "create", name = "创建商品")
    public Result<?> add(@RequestBody Product product) {
        productService.save(product);
        return Result.ok();
    }

    @PutMapping
    @Permission(code = "update", name = "更新商品")
    public Result<?> update(@RequestBody Product product) {
        productService.updateById(product);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除商品")
    public Result<?> delete(@PathVariable Long id) {
        productService.removeById(id);
        return Result.ok();
    }
}