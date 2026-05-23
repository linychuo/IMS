package com.ims.finance.controller;

import com.ims.core.result.Result;
import com.ims.finance.entity.ExpenseItem;
import com.ims.finance.mapper.ExpenseItemMapper;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 费用项目 Controller
 */
@RestController
@RequestMapping("/api/expense-item")
@Permission(code = "finance:expenseItem", name = "费用项目管理")
public class ExpenseItemController {

    @Autowired
    private ExpenseItemMapper expenseItemMapper;

    /**
     * 查询所有费用项目
     */
    @GetMapping("/list")
    @Permission(code = "read", name = "查看费用项目")
    public Result<List<ExpenseItem>> list() {
        return Result.success(expenseItemMapper.selectList(null));
    }

    /**
     * 获取费用项目详情
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看费用项目")
    public Result<ExpenseItem> getById(@PathVariable Long id) {
        return Result.success(expenseItemMapper.selectById(id));
    }

    /**
     * 创建费用项目
     */
    @PostMapping
    @Permission(code = "add", name = "新增费用项目")
    public Result<Boolean> create(@RequestBody ExpenseItem item) {
        return Result.success(expenseItemMapper.insert(item) > 0);
    }

    /**
     * 更新费用项目
     */
    @PutMapping("/{id}")
    @Permission(code = "edit", name = "编辑费用项目")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody ExpenseItem item) {
        item.setId(id);
        return Result.success(expenseItemMapper.updateById(item) > 0);
    }

    /**
     * 删除费用项目
     */
    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除费用项目")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(expenseItemMapper.deleteById(id) > 0);
    }
}