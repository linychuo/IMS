package com.ims.finance.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.finance.entity.Expense;
import com.ims.finance.service.impl.ExpenseServiceImpl.ExpenseStatistics;

import java.util.List;

/**
 * 费用 Service
 */
public interface ExpenseService extends IService<Expense> {

    /**
     * 创建费用单
     */
    boolean createExpense(Expense expense);

    /**
     * 审核费用单
     */
    boolean auditExpense(Long id);

    /**
     * 付款费用单
     */
    boolean payExpense(Long id);

    /**
     * 取消费用单
     */
    boolean cancelExpense(Long id);

    /**
     * 按类型查询费用
     */
    List<Expense> selectByType(Integer expenseType);

    /**
     * 按部门查询费用
     */
    List<Expense> selectByDepartment(Long departmentId);

    /**
     * 获取费用统计
     */
    ExpenseStatistics getStatistics();
}