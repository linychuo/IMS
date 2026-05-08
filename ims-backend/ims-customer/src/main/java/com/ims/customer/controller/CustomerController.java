package com.ims.customer.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.customer.entity.Customer;
import com.ims.customer.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 客户Controller
 */
@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    /**
     * 分页查询
     */
    @GetMapping("/page")
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

    /**
     * 列表查询
     */
    @GetMapping("/list")
    public Result<?> list(@RequestParam(required = false) String keyword) {
        LambdaQueryWrapper<Customer> wrapper = new LambdaQueryWrapper<>();
        wrapper.like(keyword != null, Customer::getName, keyword)
                .orderByDesc(Customer::getCreateTime);
        return Result.ok(customerService.list(wrapper));
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public Result<Customer> get(@PathVariable Long id) {
        Customer customer = customerService.getById(id);
        return customer != null ? Result.ok(customer) : Result.error("客户不存在");
    }

    /**
     * 新增
     */
    @PostMapping
    public Result<?> add(@RequestBody Customer customer) {
        customerService.save(customer);
        return Result.ok();
    }

    /**
     * 修改
     */
    @PutMapping
    public Result<?> update(@RequestBody Customer customer) {
        customerService.updateById(customer);
        return Result.ok();
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable Long id) {
        customerService.removeById(id);
        return Result.ok();
    }
}