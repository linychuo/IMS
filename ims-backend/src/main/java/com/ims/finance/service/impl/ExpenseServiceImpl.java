package com.ims.finance.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.common.util.OrderNoGenerator;
import com.ims.finance.entity.Expense;
import com.ims.finance.mapper.ExpenseMapper;
import com.ims.finance.service.ExpenseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 费用 Service 实现
 */
@Service
public class ExpenseServiceImpl extends ServiceImpl<ExpenseMapper, Expense> implements ExpenseService {

    @Override
    @Transactional
    public boolean createExpense(Expense expense) {
        expense.setExpenseNo(OrderNoGenerator.generateOrderNo("EX"));
        if (expense.getStatus() == null) {
            expense.setStatus(1); // 待审核
        }
        return this.save(expense);
    }

    @Override
    @Transactional
    public boolean auditExpense(Long id) {
        Expense expense = this.getById(id);
        if (expense == null) {
            throw new RuntimeException("费用单不存在");
        }
        if (expense.getStatus() != 1) {
            throw new RuntimeException("费用单状态不允许审核");
        }
        expense.setStatus(2); // 已审核
        expense.setAuditTime(LocalDateTime.now());
        return this.updateById(expense);
    }

    @Override
    @Transactional
    public boolean payExpense(Long id) {
        Expense expense = this.getById(id);
        if (expense == null) {
            throw new RuntimeException("费用单不存在");
        }
        if (expense.getStatus() != 2) {
            throw new RuntimeException("费用单状态不允许付款");
        }
        expense.setStatus(3); // 已付款
        expense.setPayTime(LocalDateTime.now());
        return this.updateById(expense);
    }

    @Override
    @Transactional
    public boolean cancelExpense(Long id) {
        Expense expense = this.getById(id);
        if (expense == null) {
            throw new RuntimeException("费用单不存在");
        }
        if (expense.getStatus() == 3) {
            throw new RuntimeException("费用单已付款不允许取消");
        }
        expense.setStatus(4); // 已取消
        return this.updateById(expense);
    }

    @Override
    public List<Expense> selectByType(Integer expenseType) {
        LambdaQueryWrapper<Expense> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Expense::getExpenseType, expenseType)
               .eq(Expense::getDeleted, 0);
        return this.list(wrapper);
    }

    @Override
    public List<Expense> selectByDepartment(Long departmentId) {
        LambdaQueryWrapper<Expense> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Expense::getDepartmentId, departmentId)
               .eq(Expense::getDeleted, 0);
        return this.list(wrapper);
    }

    @Override
    public ExpenseStatistics getStatistics() {
        ExpenseStatistics stats = new ExpenseStatistics();

        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);

        LambdaQueryWrapper<Expense> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Expense::getDeleted, 0);

        // 本月总计
        wrapper.ge(Expense::getExpenseDate, startOfMonth);
        var list = this.list(wrapper);

        BigDecimal totalAmount = list.stream()
                .map(Expense::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setMonthTotalAmount(totalAmount);

        // 待审核数量
        wrapper.clear();
        wrapper.eq(Expense::getDeleted, 0).eq(Expense::getStatus, 1);
        stats.setPendingAuditCount(this.count(wrapper));

        // 已审核数量
        wrapper.clear();
        wrapper.eq(Expense::getDeleted, 0).eq(Expense::getStatus, 2);
        stats.setAuditedCount(this.count(wrapper));

        // 已付款数量
        wrapper.clear();
        wrapper.eq(Expense::getDeleted, 0).eq(Expense::getStatus, 3);
        stats.setPaidCount(this.count(wrapper));

        return stats;
    }

    public static class ExpenseStatistics {
        private BigDecimal monthTotalAmount;
        private long pendingAuditCount;
        private long auditedCount;
        private long paidCount;

        public BigDecimal getMonthTotalAmount() { return monthTotalAmount; }
        public void setMonthTotalAmount(BigDecimal monthTotalAmount) { this.monthTotalAmount = monthTotalAmount; }
        public long getPendingAuditCount() { return pendingAuditCount; }
        public void setPendingAuditCount(long pendingAuditCount) { this.pendingAuditCount = pendingAuditCount; }
        public long getAuditedCount() { return auditedCount; }
        public void setAuditedCount(long auditedCount) { this.auditedCount = auditedCount; }
        public long getPaidCount() { return paidCount; }
        public void setPaidCount(long paidCount) { this.paidCount = paidCount; }
    }
}