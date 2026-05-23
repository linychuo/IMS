package com.ims.finance.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.common.util.OrderNoGenerator;
import com.ims.finance.entity.BankReceipt;
import com.ims.finance.entity.Receivable;
import com.ims.finance.entity.WriteoffRecord;
import com.ims.finance.mapper.BankReceiptMapper;
import com.ims.finance.mapper.ReceivableMapper;
import com.ims.finance.mapper.WriteoffRecordMapper;
import com.ims.finance.service.BankReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 银行收款认领 Service 实现
 */
@Service
public class BankReceiptServiceImpl extends ServiceImpl<BankReceiptMapper, BankReceipt> implements BankReceiptService {

    @Autowired
    private ReceivableMapper receivableMapper;

    @Autowired
    private WriteoffRecordMapper writeoffRecordMapper;

    @Override
    public List<BankReceipt> selectPendingByCustomer(Long customerId) {
        return baseMapper.selectPendingByCustomer(customerId);
    }

    @Override
    public List<BankReceipt> selectAllPending() {
        return baseMapper.selectAllPending();
    }

    @Override
    @Transactional
    public boolean createReceipt(BankReceipt receipt) {
        receipt.setReceiptNo(OrderNoGenerator.generateFinanceInNo());
        receipt.setClaimedAmount(BigDecimal.ZERO);
        receipt.setPendingAmount(receipt.getAmount());
        receipt.setStatus(0);
        return this.save(receipt);
    }

    @Override
    @Transactional
    public boolean claimReceipt(Long receiptId, Long receivableId, BigDecimal claimAmount) {
        BankReceipt receipt = this.getById(receiptId);
        if (receipt == null) {
            throw new RuntimeException("收款记录不存在");
        }

        Receivable receivable = receivableMapper.selectById(receivableId);
        if (receivable == null) {
            throw new RuntimeException("应收记录不存在");
        }

        // 检查认领金额是否超过可用金额
        if (claimAmount.compareTo(receipt.getPendingAmount()) > 0) {
            throw new RuntimeException("认领金额超过待认领金额");
        }
        if (claimAmount.compareTo(receivable.getPendingAmount()) > 0) {
            throw new RuntimeException("认领金额超过待收金额");
        }

        // 更新收款记录
        receipt.setClaimedAmount(receipt.getClaimedAmount().add(claimAmount));
        receipt.setPendingAmount(receipt.getPendingAmount().subtract(claimAmount));
        if (receipt.getPendingAmount().compareTo(BigDecimal.ZERO) == 0) {
            receipt.setStatus(2); // 已认领
        } else {
            receipt.setStatus(1); // 部分认领
        }
        this.updateById(receipt);

        // 更新应收记录
        receivable.setReceivedAmount(receivable.getReceivedAmount().add(claimAmount));
        receivable.setPendingAmount(receivable.getPendingAmount().subtract(claimAmount));
        if (receivable.getPendingAmount().compareTo(BigDecimal.ZERO) == 0) {
            receivable.setStatus(3); // 已结清
        } else {
            receivable.setStatus(2); // 部分收款
        }
        receivableMapper.updateById(receivable);

        // 创建核销记录
        WriteoffRecord record = new WriteoffRecord();
        record.setWriteoffNo(OrderNoGenerator.generateWriteoffNo());
        record.setWriteoffType("RECEIVABLE");
        record.setSourceId(String.valueOf(receivableId));
        record.setSourceNo(receivable.getReceivableNo());
        record.setTargetId(String.valueOf(receiptId));
        record.setTargetNo(receipt.getReceiptNo());
        record.setAmount(claimAmount);
        record.setWriteoffTime(LocalDateTime.now());
        record.setStatus(1);
        writeoffRecordMapper.insert(record);

        return true;
    }

    @Override
    @Transactional
    public boolean autoClaim(Long receiptId) {
        BankReceipt receipt = this.getById(receiptId);
        if (receipt == null) {
            throw new RuntimeException("收款记录不存在");
        }

        // 查找该客户的所有未结清应收
        LambdaQueryWrapper<Receivable> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Receivable::getCustomerId, receipt.getCustomerId())
               .eq(Receivable::getStatus, 1) // 未结清
               .gt(Receivable::getPendingAmount, BigDecimal.ZERO);
        wrapper.orderByAsc(Receivable::getDueDate); // 优先按到期日期

        List<Receivable> receivables = receivableMapper.selectList(wrapper);

        BigDecimal remainingAmount = receipt.getPendingAmount();
        for (Receivable receivable : receivables) {
            if (remainingAmount.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            BigDecimal claimAmount = remainingAmount.min(receivable.getPendingAmount());
            claimReceipt(receiptId, receivable.getId(), claimAmount);
            remainingAmount = remainingAmount.subtract(claimAmount);
        }

        if (remainingAmount.compareTo(BigDecimal.ZERO) > 0) {
            // 还有剩余金额未认领，更新状态为部分认领
            receipt.setStatus(1);
            this.updateById(receipt);
        }

        return true;
    }

    @Override
    public BigDecimal getCustomerPendingAmount(Long customerId) {
        List<BankReceipt> receipts = selectPendingByCustomer(customerId);
        return receipts.stream()
                .map(BankReceipt::getPendingAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}