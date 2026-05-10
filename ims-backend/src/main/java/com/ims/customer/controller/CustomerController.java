package com.ims.customer.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.customer.entity.Customer;
import com.ims.customer.service.CustomerService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customer")
@Permission(code = "customer:customer", name = "客户管理")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/page")
    @Permission(code = "read", name = "查看客户")
    public Result<PageResult<Customer>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword) {
        Page<Customer> page = new Page<>(current, size);
        LambdaQueryWrapper<Customer> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, Customer::getName, keyword)
                .orderByDesc(Customer::getCreateTime);
        IPage<Customer> result = customerService.page(page, wrapper);
        return Result.ok(PageResult.build(result.getRecords(), result.getTotal(), current, size));
    }

    @GetMapping("/list")
    @Permission(code = "read", name = "查看客户")
    public Result<?> list(@RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<Customer> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, Customer::getName, keyword)
                .orderByDesc(Customer::getCreateTime);
        return Result.ok(customerService.list(wrapper));
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看客户")
    public Result<Customer> get(@PathVariable Long id) {
        Customer customer = customerService.getById(id);
        return customer != null ? Result.ok(customer) : Result.error("客户不存在");
    }

    @PostMapping
    @Permission(code = "create", name = "创建客户")
    public Result<?> add(@RequestBody Customer customer) {
        customerService.save(customer);
        return Result.ok();
    }

    @PutMapping
    @Permission(code = "update", name = "更新客户")
    public Result<?> update(@RequestBody Customer customer) {
        customerService.updateById(customer);
        return Result.ok();
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除客户")
    public Result<?> delete(@PathVariable Long id) {
        customerService.removeById(id);
        return Result.ok();
    }
}