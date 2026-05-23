package com.ims.finance.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.common.util.OrderNoGenerator;
import com.ims.customer.entity.Customer;
import com.ims.customer.mapper.CustomerMapper;
import com.ims.finance.dto.CustomerReconciliationDetailDTO;
import com.ims.finance.entity.CustomerReconciliation;
import com.ims.finance.entity.Receivable;
import com.ims.finance.entity.WriteoffRecord;
import com.ims.finance.mapper.CustomerReconciliationMapper;
import com.ims.finance.mapper.ReceivableMapper;
import com.ims.finance.mapper.WriteoffRecordMapper;
import com.ims.finance.service.CustomerReconciliationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 客户对账 Service 实现
 */
@Service
public class CustomerReconciliationServiceImpl
        extends ServiceImpl<CustomerReconciliationMapper, CustomerReconciliation>
        implements CustomerReconciliationService {

    @Autowired
    private ReceivableMapper receivableMapper;

    @Autowired
    private WriteoffRecordMapper writeoffRecordMapper;

    @Autowired
    private CustomerMapper customerMapper;

    @Override
    @Transactional
    public CustomerReconciliation generate(Long customerId, LocalDate startDate, LocalDate endDate) {
        Customer customer = customerMapper.selectById(customerId);
        if (customer == null) {
            throw new RuntimeException("客户不存在");
        }

        // 计算期初应收（对账截止日期之前的应收余额）
        BigDecimal openingAmount = getClosingAmountBefore(customerId, startDate.minusDays(1));

        // 计算本期应收（对账期间新增的应收）
        LambdaQueryWrapper<Receivable> receivableWrapper = new LambdaQueryWrapper<>();
        receivableWrapper.eq(Receivable::getCustomerId, customerId)
                .ge(Receivable::getCreateTime, startDate.atStartOfDay())
                .le(Receivable::getCreateTime, endDate.plusDays(1).atStartOfDay());
        List<Receivable> receivables = receivableMapper.selectList(receivableWrapper);
        BigDecimal periodReceivable = receivables.stream()
                .map(Receivable::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 计算本期收款（对账期间的核销金额）
        LambdaQueryWrapper<WriteoffRecord> writeoffWrapper = new LambdaQueryWrapper<>();
        writeoffWrapper.eq(WriteoffRecord::getWriteoffType, "RECEIVABLE")
                .ge(WriteoffRecord::getWriteoffTime, startDate.atStartOfDay())
                .le(WriteoffRecord::getWriteoffTime, endDate.plusDays(1).atStartOfDay());
        // 需要按客户筛选，通过sourceId关联查找
        List<WriteoffRecord> writeoffs = writeoffRecordMapper.selectList(writeoffWrapper);
        BigDecimal periodReceipt = BigDecimal.ZERO;
        for (WriteoffRecord writeoff : writeoffs) {
            Receivable receivable = receivableMapper.selectById(Long.parseLong(writeoff.getSourceId()));
            if (receivable != null && receivable.getCustomerId().equals(customerId)) {
                periodReceipt = periodReceipt.add(writeoff.getAmount());
            }
        }

        // 计算期末应收
        BigDecimal closingAmount = openingAmount.add(periodReceivable).subtract(periodReceipt);

        // 创建对账单
        CustomerReconciliation reconciliation = new CustomerReconciliation();
        reconciliation.setReconciliationNo(OrderNoGenerator.generateOrderNo("CR"));
        reconciliation.setCustomerId(customerId);
        reconciliation.setCustomerName(customer.getName());
        reconciliation.setStartDate(startDate);
        reconciliation.setEndDate(endDate);
        reconciliation.setOpeningAmount(openingAmount);
        reconciliation.setPeriodReceivable(periodReceivable);
        reconciliation.setPeriodReceipt(periodReceipt);
        reconciliation.setClosingAmount(closingAmount);
        reconciliation.setStatus(1); // 待确认
        this.save(reconciliation);

        return reconciliation;
    }

    @Override
    @Transactional
    public boolean confirm(Long id) {
        CustomerReconciliation reconciliation = this.getById(id);
        if (reconciliation == null) {
            throw new RuntimeException("对账单不存在");
        }
        if (reconciliation.getStatus() != 1) {
            throw new RuntimeException("对账单状态不允许确认");
        }
        reconciliation.setStatus(2); // 已确认
        reconciliation.setConfirmTime(java.time.LocalDateTime.now());
        return this.updateById(reconciliation);
    }

    @Override
    public List<CustomerReconciliationDetailDTO> getDetail(Long customerId, LocalDate startDate, LocalDate endDate) {
        List<CustomerReconciliationDetailDTO> details = new ArrayList<>();
        BigDecimal balance = getClosingAmountBefore(customerId, startDate.minusDays(1));

        // 期初余额
        CustomerReconciliationDetailDTO opening = new CustomerReconciliationDetailDTO();
        opening.setDate(startDate);
        opening.setType("OPENING");
        opening.setSummary("期初应收");
        opening.setAmount(balance);
        opening.setBalance(balance);
        details.add(opening);

        // 本期应收明细
        LambdaQueryWrapper<Receivable> receivableWrapper = new LambdaQueryWrapper<>();
        receivableWrapper.eq(Receivable::getCustomerId, customerId)
                .ge(Receivable::getCreateTime, startDate.atStartOfDay())
                .le(Receivable::getCreateTime, endDate.plusDays(1).atStartOfDay())
                .orderByAsc(Receivable::getCreateTime);
        List<Receivable> receivables = receivableMapper.selectList(receivableWrapper);
        for (Receivable receivable : receivables) {
            CustomerReconciliationDetailDTO detail = new CustomerReconciliationDetailDTO();
            detail.setDate(receivable.getCreateTime().toLocalDate());
            detail.setOrderNo(receivable.getReceivableNo());
            detail.setType("RECEIVABLE");
            detail.setSummary("销售应收");
            detail.setAmount(receivable.getTotalAmount());
            balance = balance.add(receivable.getTotalAmount());
            detail.setBalance(balance);
            details.add(detail);
        }

        // 本期收款核销明细
        LambdaQueryWrapper<WriteoffRecord> writeoffWrapper = new LambdaQueryWrapper<>();
        writeoffWrapper.eq(WriteoffRecord::getWriteoffType, "RECEIVABLE")
                .ge(WriteoffRecord::getWriteoffTime, startDate.atStartOfDay())
                .le(WriteoffRecord::getWriteoffTime, endDate.plusDays(1).atStartOfDay());
        List<WriteoffRecord> writeoffs = writeoffRecordMapper.selectList(writeoffWrapper);
        for (WriteoffRecord writeoff : writeoffs) {
            Receivable receivable = receivableMapper.selectById(Long.parseLong(writeoff.getSourceId()));
            if (receivable != null && receivable.getCustomerId().equals(customerId)) {
                CustomerReconciliationDetailDTO detail = new CustomerReconciliationDetailDTO();
                detail.setDate(writeoff.getWriteoffTime().toLocalDate());
                detail.setOrderNo(writeoff.getTargetNo());
                detail.setType("RECEIPT");
                detail.setSummary("收款核销");
                detail.setAmount(writeoff.getAmount());
                balance = balance.subtract(writeoff.getAmount());
                detail.setBalance(balance);
                details.add(detail);
            }
        }

        return details;
    }

    @Override
    public List<CustomerReconciliation> selectByCustomer(Long customerId) {
        LambdaQueryWrapper<CustomerReconciliation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(CustomerReconciliation::getCustomerId, customerId)
                .orderByDesc(CustomerReconciliation::getCreateTime);
        return this.list(wrapper);
    }

    @Override
    public BigDecimal getClosingAmountBefore(Long customerId, LocalDate beforeDate) {
        LambdaQueryWrapper<Receivable> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Receivable::getCustomerId, customerId)
                .le(Receivable::getCreateTime, beforeDate.plusDays(1).atStartOfDay());
        List<Receivable> receivables = receivableMapper.selectList(wrapper);
        BigDecimal total = receivables.stream()
                .map(Receivable::getPendingAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total;
    }
}