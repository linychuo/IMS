package com.ims.finance.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.common.util.OrderNoGenerator;
import com.ims.finance.dto.CustomerReconciliationDetailDTO;
import com.ims.finance.entity.Payable;
import com.ims.finance.entity.SupplierReconciliation;
import com.ims.finance.entity.WriteoffRecord;
import com.ims.finance.mapper.PayableMapper;
import com.ims.finance.mapper.SupplierReconciliationMapper;
import com.ims.finance.mapper.WriteoffRecordMapper;
import com.ims.finance.service.SupplierReconciliationService;
import com.ims.procurement.entity.Supplier;
import com.ims.procurement.mapper.SupplierMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/**
 * 供应商对账 Service 实现
 */
@Service
public class SupplierReconciliationServiceImpl
        extends ServiceImpl<SupplierReconciliationMapper, SupplierReconciliation>
        implements SupplierReconciliationService {

    @Autowired
    private PayableMapper payableMapper;

    @Autowired
    private WriteoffRecordMapper writeoffRecordMapper;

    @Autowired
    private SupplierMapper supplierMapper;

    @Override
    @Transactional
    public SupplierReconciliation generate(Long supplierId, LocalDate startDate, LocalDate endDate) {
        Supplier supplier = supplierMapper.selectById(supplierId);
        if (supplier == null) {
            throw new RuntimeException("供应商不存在");
        }

        // 计算期初应付
        BigDecimal openingAmount = getClosingAmountBefore(supplierId, startDate.minusDays(1));

        // 计算本期应付
        LambdaQueryWrapper<Payable> payableWrapper = new LambdaQueryWrapper<>();
        payableWrapper.eq(Payable::getSupplierId, supplierId)
                .ge(Payable::getCreateTime, startDate.atStartOfDay())
                .le(Payable::getCreateTime, endDate.plusDays(1).atStartOfDay());
        List<Payable> payables = payableMapper.selectList(payableWrapper);
        BigDecimal periodPayable = payables.stream()
                .map(Payable::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 计算本期付款
        LambdaQueryWrapper<WriteoffRecord> writeoffWrapper = new LambdaQueryWrapper<>();
        writeoffWrapper.eq(WriteoffRecord::getWriteoffType, "PAYABLE")
                .ge(WriteoffRecord::getWriteoffTime, startDate.atStartOfDay())
                .le(WriteoffRecord::getWriteoffTime, endDate.plusDays(1).atStartOfDay());
        List<WriteoffRecord> writeoffs = writeoffRecordMapper.selectList(writeoffWrapper);
        BigDecimal periodPayment = BigDecimal.ZERO;
        for (WriteoffRecord writeoff : writeoffs) {
            Payable payable = payableMapper.selectById(Long.parseLong(writeoff.getSourceId()));
            if (payable != null && payable.getSupplierId().equals(supplierId)) {
                periodPayment = periodPayment.add(writeoff.getAmount());
            }
        }

        // 计算期末应付
        BigDecimal closingAmount = openingAmount.add(periodPayable).subtract(periodPayment);

        // 创建对账单
        SupplierReconciliation reconciliation = new SupplierReconciliation();
        reconciliation.setReconciliationNo(OrderNoGenerator.generateOrderNo("SR"));
        reconciliation.setSupplierId(supplierId);
        reconciliation.setSupplierName(supplier.getName());
        reconciliation.setStartDate(startDate);
        reconciliation.setEndDate(endDate);
        reconciliation.setOpeningAmount(openingAmount);
        reconciliation.setPeriodPayable(periodPayable);
        reconciliation.setPeriodPayment(periodPayment);
        reconciliation.setClosingAmount(closingAmount);
        reconciliation.setStatus(1);
        this.save(reconciliation);

        return reconciliation;
    }

    @Override
    @Transactional
    public boolean confirm(Long id) {
        SupplierReconciliation reconciliation = this.getById(id);
        if (reconciliation == null) {
            throw new RuntimeException("对账单不存在");
        }
        if (reconciliation.getStatus() != 1) {
            throw new RuntimeException("对账单状态不允许确认");
        }
        reconciliation.setStatus(2);
        reconciliation.setConfirmTime(java.time.LocalDateTime.now());
        return this.updateById(reconciliation);
    }

    @Override
    public List<CustomerReconciliationDetailDTO> getDetail(Long supplierId, LocalDate startDate, LocalDate endDate) {
        // 复用客户对账明的细结构，只是类型不同
        List<CustomerReconciliationDetailDTO> details = new ArrayList<>();
        BigDecimal balance = getClosingAmountBefore(supplierId, startDate.minusDays(1));

        // 期初余额
        CustomerReconciliationDetailDTO opening = new CustomerReconciliationDetailDTO();
        opening.setDate(startDate);
        opening.setType("OPENING");
        opening.setSummary("期初应付");
        opening.setAmount(balance);
        opening.setBalance(balance);
        details.add(opening);

        // 本期应付明细
        LambdaQueryWrapper<Payable> payableWrapper = new LambdaQueryWrapper<>();
        payableWrapper.eq(Payable::getSupplierId, supplierId)
                .ge(Payable::getCreateTime, startDate.atStartOfDay())
                .le(Payable::getCreateTime, endDate.plusDays(1).atStartOfDay())
                .orderByAsc(Payable::getCreateTime);
        List<Payable> payables = payableMapper.selectList(payableWrapper);
        for (Payable payable : payables) {
            CustomerReconciliationDetailDTO detail = new CustomerReconciliationDetailDTO();
            detail.setDate(payable.getCreateTime().toLocalDate());
            detail.setOrderNo(payable.getPayableNo());
            detail.setType("PAYABLE");
            detail.setSummary("采购应付");
            detail.setAmount(payable.getTotalAmount());
            balance = balance.add(payable.getTotalAmount());
            detail.setBalance(balance);
            details.add(detail);
        }

        // 本期付款核销明细
        LambdaQueryWrapper<WriteoffRecord> writeoffWrapper = new LambdaQueryWrapper<>();
        writeoffWrapper.eq(WriteoffRecord::getWriteoffType, "PAYABLE")
                .ge(WriteoffRecord::getWriteoffTime, startDate.atStartOfDay())
                .le(WriteoffRecord::getWriteoffTime, endDate.plusDays(1).atStartOfDay());
        List<WriteoffRecord> writeoffs = writeoffRecordMapper.selectList(writeoffWrapper);
        for (WriteoffRecord writeoff : writeoffs) {
            Payable payable = payableMapper.selectById(Long.parseLong(writeoff.getSourceId()));
            if (payable != null && payable.getSupplierId().equals(supplierId)) {
                CustomerReconciliationDetailDTO detail = new CustomerReconciliationDetailDTO();
                detail.setDate(writeoff.getWriteoffTime().toLocalDate());
                detail.setOrderNo(writeoff.getTargetNo());
                detail.setType("PAYMENT");
                detail.setSummary("付款核销");
                detail.setAmount(writeoff.getAmount());
                balance = balance.subtract(writeoff.getAmount());
                detail.setBalance(balance);
                details.add(detail);
            }
        }

        return details;
    }

    @Override
    public List<SupplierReconciliation> selectBySupplier(Long supplierId) {
        LambdaQueryWrapper<SupplierReconciliation> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SupplierReconciliation::getSupplierId, supplierId)
                .orderByDesc(SupplierReconciliation::getCreateTime);
        return this.list(wrapper);
    }

    @Override
    public BigDecimal getClosingAmountBefore(Long supplierId, LocalDate beforeDate) {
        LambdaQueryWrapper<Payable> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Payable::getSupplierId, supplierId)
                .le(Payable::getCreateTime, beforeDate.plusDays(1).atStartOfDay());
        List<Payable> payables = payableMapper.selectList(wrapper);
        BigDecimal total = payables.stream()
                .map(Payable::getPendingAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return total;
    }
}