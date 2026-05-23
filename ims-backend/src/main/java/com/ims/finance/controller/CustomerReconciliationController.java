package com.ims.finance.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.finance.dto.CustomerReconciliationDetailDTO;
import com.ims.finance.entity.CustomerReconciliation;
import com.ims.finance.service.CustomerReconciliationService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * 客户对账 Controller
 */
@RestController
@RequestMapping("/api/customer-reconciliation")
@Permission(code = "finance:customerReconciliation", name = "客户对账")
public class CustomerReconciliationController {

    @Autowired
    private CustomerReconciliationService customerReconciliationService;

    /**
     * 分页查询客户对账单
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看对账")
    public Result<PageResult<CustomerReconciliation>> page(
            @RequestParam Long page,
            @RequestParam Long pageSize,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Integer status) {

        var wrapper = new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<CustomerReconciliation>();
        if (customerId != null) {
            wrapper.eq(CustomerReconciliation::getCustomerId, customerId);
        }
        if (status != null) {
            wrapper.eq(CustomerReconciliation::getStatus, status);
        }
        wrapper.eq(CustomerReconciliation::getDeleted, 0)
                .orderByDesc(CustomerReconciliation::getCreateTime);

        long total = customerReconciliationService.count(wrapper);
        long offset = (page - 1) * pageSize;
        wrapper.last("LIMIT " + offset + ", " + pageSize);

        List<CustomerReconciliation> records = customerReconciliationService.list(wrapper);
        return Result.success(PageResult.build(records, total, page, pageSize));
    }

    /**
     * 获取对账单详情
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看对账")
    public Result<CustomerReconciliation> getById(@PathVariable Long id) {
        return Result.success(customerReconciliationService.getById(id));
    }

    /**
     * 生成客户对账单
     */
    @PostMapping("/generate")
    @Permission(code = "add", name = "生成对账")
    public Result<CustomerReconciliation> generate(
            @RequestParam Long customerId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return Result.success(customerReconciliationService.generate(customerId, startDate, endDate));
    }

    /**
     * 确认对账单
     */
    @PostMapping("/{id}/confirm")
    @Permission(code = "confirm", name = "确认对账")
    public Result<Boolean> confirm(@PathVariable Long id) {
        return Result.success(customerReconciliationService.confirm(id));
    }

    /**
     * 获取对账明细
     */
    @GetMapping("/detail")
    @Permission(code = "read", name = "查看对账")
    public Result<List<CustomerReconciliationDetailDTO>> getDetail(
            @RequestParam Long customerId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        return Result.success(customerReconciliationService.getDetail(customerId, startDate, endDate));
    }

    /**
     * 按客户查询对账单
     */
    @GetMapping("/customer/{customerId}")
    @Permission(code = "read", name = "查看对账")
    public Result<List<CustomerReconciliation>> getByCustomer(@PathVariable Long customerId) {
        return Result.success(customerReconciliationService.selectByCustomer(customerId));
    }
}