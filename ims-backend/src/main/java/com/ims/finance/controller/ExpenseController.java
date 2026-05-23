package com.ims.finance.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.finance.entity.Expense;
import com.ims.finance.service.ExpenseService;
import com.ims.finance.service.impl.ExpenseServiceImpl.ExpenseStatistics;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 费用 Controller
 */
@RestController
@RequestMapping("/api/expense")
@Permission(code = "finance:expense", name = "费用管理")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    /**
     * 分页查询费用
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看费用")
    public Result<PageResult<Expense>> page(
            @RequestParam Long page,
            @RequestParam Long pageSize,
            @RequestParam(required = false) Integer expenseType,
            @RequestParam(required = false) Integer status) {

        var wrapper = new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Expense>();
        if (expenseType != null) {
            wrapper.eq(Expense::getExpenseType, expenseType);
        }
        if (status != null) {
            wrapper.eq(Expense::getStatus, status);
        }
        wrapper.eq(Expense::getDeleted, 0);

        long total = expenseService.count(wrapper);
        long offset = (page - 1) * pageSize;
        wrapper.last("LIMIT " + offset + ", " + pageSize);

        List<Expense> records = expenseService.list(wrapper);
        return Result.success(PageResult.build(records, total, page, pageSize));
    }

    /**
     * 获取费用详情
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看费用")
    public Result<Expense> getById(@PathVariable Long id) {
        return Result.success(expenseService.getById(id));
    }

    /**
     * 创建费用单
     */
    @PostMapping
    @Permission(code = "add", name = "新增费用")
    public Result<Boolean> create(@RequestBody Expense expense) {
        return Result.success(expenseService.createExpense(expense));
    }

    /**
     * 更新费用单
     */
    @PutMapping("/{id}")
    @Permission(code = "edit", name = "编辑费用")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody Expense expense) {
        expense.setId(id);
        return Result.success(expenseService.updateById(expense));
    }

    /**
     * 删除费用单
     */
    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除费用")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(expenseService.removeById(id));
    }

    /**
     * 审核费用单
     */
    @PostMapping("/{id}/audit")
    @Permission(code = "audit", name = "审核费用")
    public Result<Boolean> audit(@PathVariable Long id) {
        return Result.success(expenseService.auditExpense(id));
    }

    /**
     * 付款费用单
     */
    @PostMapping("/{id}/pay")
    @Permission(code = "pay", name = "付款费用")
    public Result<Boolean> pay(@PathVariable Long id) {
        return Result.success(expenseService.payExpense(id));
    }

    /**
     * 取消费用单
     */
    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消费用")
    public Result<Boolean> cancel(@PathVariable Long id) {
        return Result.success(expenseService.cancelExpense(id));
    }

    /**
     * 按类型查询费用
     */
    @GetMapping("/type/{expenseType}")
    @Permission(code = "read", name = "查看费用")
    public Result<List<Expense>> getByType(@PathVariable Integer expenseType) {
        return Result.success(expenseService.selectByType(expenseType));
    }

    /**
     * 按部门查询费用
     */
    @GetMapping("/department/{departmentId}")
    @Permission(code = "read", name = "查看费用")
    public Result<List<Expense>> getByDepartment(@PathVariable Long departmentId) {
        return Result.success(expenseService.selectByDepartment(departmentId));
    }

    /**
     * 获取费用统计
     */
    @GetMapping("/statistics")
    @Permission(code = "read", name = "查看费用")
    public Result<ExpenseStatistics> getStatistics() {
        return Result.success(expenseService.getStatistics());
    }
}