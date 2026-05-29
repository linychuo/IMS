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

    public static class ExpenseSummary {
        private BigDecimal totalAmount;
        private long count;
        private List<ExpenseTypeSummary> details;

        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
        public List<ExpenseTypeSummary> getDetails() { return details; }
        public void setDetails(List<ExpenseTypeSummary> details) { this.details = details; }
    }

    public static class ExpenseTypeSummary {
        private Integer expenseType;
        private String expenseTypeName;
        private BigDecimal totalAmount;
        private long count;

        public Integer getExpenseType() { return expenseType; }
        public void setExpenseType(Integer expenseType) { this.expenseType = expenseType; }
        public String getExpenseTypeName() { return expenseTypeName; }
        public void setExpenseTypeName(String expenseTypeName) { this.expenseTypeName = expenseTypeName; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
    }

    @Override
    public ExpenseSummary getSummary(String startDate, String endDate) {
        LambdaQueryWrapper<Expense> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Expense::getDeleted, 0);

        if (startDate != null && !startDate.isEmpty()) {
            wrapper.ge(Expense::getExpenseDate, LocalDate.parse(startDate));
        }
        if (endDate != null && !endDate.isEmpty()) {
            wrapper.le(Expense::getExpenseDate, LocalDate.parse(endDate));
        }

        List<Expense> expenses = this.list(wrapper);

        ExpenseSummary summary = new ExpenseSummary();
        BigDecimal totalAmount = expenses.stream()
                .map(Expense::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        summary.setTotalAmount(totalAmount);
        summary.setCount(expenses.size());

        // 按类型分组汇总
        java.util.Map<Integer, List<Expense>> byType = expenses.stream()
                .collect(java.util.stream.Collectors.groupingBy(Expense::getExpenseType));

        List<ExpenseTypeSummary> details = byType.entrySet().stream()
                .map(entry -> {
                    ExpenseTypeSummary typeSummary = new ExpenseTypeSummary();
                    typeSummary.setExpenseType(entry.getKey());
                    typeSummary.setExpenseTypeName(getExpenseTypeName(entry.getKey()));
                    typeSummary.setTotalAmount(entry.getValue().stream()
                            .map(Expense::getTotalAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add));
                    typeSummary.setCount(entry.getValue().size());
                    return typeSummary;
                })
                .collect(java.util.stream.Collectors.toList());

        summary.setDetails(details);
        return summary;
    }

    private String getExpenseTypeName(Integer expenseType) {
        if (expenseType == null) return "未知";
        switch (expenseType) {
            case 1: return "管理费用";
            case 2: return "销售费用";
            case 3: return "财务费用";
            case 4: return "其他";
            default: return "未知";
        }
    }
}