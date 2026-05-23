package com.ims.finance.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.finance.entity.Invoice;
import com.ims.finance.mapper.InvoiceMapper;
import com.ims.finance.service.InvoiceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 发票 Service 实现
 */
@Service
public class InvoiceServiceImpl extends ServiceImpl<InvoiceMapper, Invoice> implements InvoiceService {

    @Override
    public List<Invoice> selectByOrder(String orderType, Long orderId) {
        return baseMapper.selectByOrder(orderType, orderId);
    }

    @Override
    public List<Invoice> selectBySupplier(Long supplierId) {
        return baseMapper.selectBySupplier(supplierId);
    }

    @Override
    public List<Invoice> selectByCustomer(Long customerId) {
        return baseMapper.selectByCustomer(customerId);
    }

    @Override
    @Transactional
    public boolean createInvoice(Invoice invoice) {
        return this.save(invoice);
    }

    @Override
    @Transactional
    public boolean checkInvoice(Long id) {
        Invoice invoice = this.getById(id);
        if (invoice == null) {
            throw new RuntimeException("发票不存在");
        }
        if (invoice.getStatus() != 0) {
            throw new RuntimeException("发票状态不允许勾选");
        }
        invoice.setStatus(1);
        invoice.setCheckDate(LocalDateTime.now());
        return this.updateById(invoice);
    }

    @Override
    @Transactional
    public boolean reimburseInvoice(Long id) {
        Invoice invoice = this.getById(id);
        if (invoice == null) {
            throw new RuntimeException("发票不存在");
        }
        if (invoice.getStatus() != 1) {
            throw new RuntimeException("发票状态不允许报销");
        }
        invoice.setStatus(2);
        return this.updateById(invoice);
    }

    @Override
    @Transactional
    public boolean voidInvoice(Long id) {
        Invoice invoice = this.getById(id);
        if (invoice == null) {
            throw new RuntimeException("发票不存在");
        }
        if (invoice.getStatus() == 3) {
            throw new RuntimeException("发票已作废");
        }
        invoice.setStatus(3);
        return this.updateById(invoice);
    }

    @Override
    public List<Invoice> getUncheckedPurchaseInvoices() {
        LambdaQueryWrapper<Invoice> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Invoice::getInvoiceType, 1)
               .eq(Invoice::getStatus, 0)
               .eq(Invoice::getDeleted, 0);
        return this.list(wrapper);
    }

    @Override
    public List<Invoice> getUncheckedSalesInvoices() {
        LambdaQueryWrapper<Invoice> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Invoice::getInvoiceType, 2)
               .eq(Invoice::getStatus, 0)
               .eq(Invoice::getDeleted, 0);
        return this.list(wrapper);
    }

    @Override
    public InvoiceStatistics getStatistics() {
        InvoiceStatistics stats = new InvoiceStatistics();

        LambdaQueryWrapper<Invoice> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Invoice::getDeleted, 0);

        long totalCount = this.count(wrapper);
        wrapper.eq(Invoice::getStatus, 0);
        long uncheckedCount = this.count(wrapper);

        wrapper.eq(Invoice::getStatus, 1);
        long checkedCount = this.count(wrapper);

        wrapper.eq(Invoice::getStatus, 2);
        long reimbursedCount = this.count(wrapper);

        wrapper.eq(Invoice::getStatus, 3);
        long voidCount = this.count(wrapper);

        stats.setTotalCount(totalCount);
        stats.setUncheckedCount(uncheckedCount);
        stats.setCheckedCount(checkedCount);
        stats.setReimbursedCount(reimbursedCount);
        stats.setVoidCount(voidCount);

        return stats;
    }

    public static class InvoiceStatistics {
        private long totalCount;
        private long uncheckedCount;
        private long checkedCount;
        private long reimbursedCount;
        private long voidCount;
        private BigDecimal totalAmount;
        private BigDecimal uncheckedAmount;
        private BigDecimal checkedAmount;

        public long getTotalCount() { return totalCount; }
        public void setTotalCount(long totalCount) { this.totalCount = totalCount; }
        public long getUncheckedCount() { return uncheckedCount; }
        public void setUncheckedCount(long uncheckedCount) { this.uncheckedCount = uncheckedCount; }
        public long getCheckedCount() { return checkedCount; }
        public void setCheckedCount(long checkedCount) { this.checkedCount = checkedCount; }
        public long getReimbursedCount() { return reimbursedCount; }
        public void setReimbursedCount(long reimbursedCount) { this.reimbursedCount = reimbursedCount; }
        public long getVoidCount() { return voidCount; }
        public void setVoidCount(long voidCount) { this.voidCount = voidCount; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        public BigDecimal getUncheckedAmount() { return uncheckedAmount; }
        public void setUncheckedAmount(BigDecimal uncheckedAmount) { this.uncheckedAmount = uncheckedAmount; }
        public BigDecimal getCheckedAmount() { return checkedAmount; }
        public void setCheckedAmount(BigDecimal checkedAmount) { this.checkedAmount = checkedAmount; }
    }
}