package com.ims.finance.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.common.util.OrderNoGenerator;
import com.ims.core.result.PageResult;
import com.ims.finance.dto.SupplierStatementDTO;
import com.ims.finance.entity.Payable;
import com.ims.finance.entity.WriteoffRecord;
import com.ims.finance.mapper.PayableMapper;
import com.ims.finance.mapper.WriteoffRecordMapper;
import com.ims.finance.service.PayableService;
import com.ims.finance.mapper.FinanceOutMapper;
import com.ims.finance.entity.FinanceOut;
import com.ims.procurement.mapper.SupplierMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 应付账款 Service 实现
 */
@Service
public class PayableServiceImpl extends ServiceImpl<PayableMapper, Payable> implements PayableService {

    @Autowired
    private WriteoffRecordMapper writeoffRecordMapper;
    @Autowired
    private OrderNoGenerator orderNoGenerator;
    @Autowired
    private FinanceOutMapper financeOutMapper;
    @Autowired
    private SupplierMapper supplierMapper;

    @Override
    public PageResult<Payable> page(Long page, Long pageSize, Long supplierId, Integer status) {
        LambdaQueryWrapper<Payable> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(supplierId != null, Payable::getSupplierId, supplierId)
              .eq(status != null, Payable::getStatus, status)
              .orderByDesc(Payable::getId);
        Page<Payable> result = this.page(new Page<>(page, pageSize), wrapper);
        return PageResult.of(result);
    }

    @Override
    public Payable getById(Long id) {
        return this.getById(id);
    }

    @Override
    @Transactional
    public boolean create(Payable payable) {
        payable.setPaidAmount(BigDecimal.ZERO);
        payable.setPendingAmount(payable.getTotalAmount());
        payable.setStatus(1);
        payable.setCreateTime(LocalDateTime.now());
        return this.save(payable);
    }

    @Override
    @Transactional
    public boolean update(Payable payable) {
        payable.setUpdateTime(LocalDateTime.now());
        return this.updateById(payable);
    }

    @Override
    @Transactional
    public boolean writeoff(Long id, Long paymentId, BigDecimal amount) {
        Payable payable = this.getById(id);
        if (payable == null) {
            return false;
        }
        // 更新已付金额和待付金额
        payable.setPaidAmount(payable.getPaidAmount().add(amount));
        payable.setPendingAmount(payable.getTotalAmount().subtract(payable.getPaidAmount()));
        payable.setUpdateTime(LocalDateTime.now());
        // 更新状态
        if (payable.getPendingAmount().compareTo(BigDecimal.ZERO) <= 0) {
            payable.setStatus(3); // 已结清
            payable.setPendingAmount(BigDecimal.ZERO);
        } else {
            payable.setStatus(2); // 部分付款
        }
        this.updateById(payable);

        // 保存核销记录
        WriteoffRecord record = new WriteoffRecord();
        record.setWriteoffNo(orderNoGenerator.generateWriteoffNo());
        record.setWriteoffType("PAYABLE");
        record.setSourceId(String.valueOf(id));
        record.setSourceNo(payable.getOrderNo());
        record.setTargetId(String.valueOf(paymentId));
        record.setAmount(amount);
        record.setWriteoffTime(LocalDateTime.now());
        record.setStatus(1);
        writeoffRecordMapper.insert(record);

        return true;
    }

    @Override
    @Transactional
    public BigDecimal autoWriteoff(Long supplierId, Long paymentId, BigDecimal totalPaymentAmount) {
        // 按到期日期升序（先进先出），查询该供应商所有未结清的应付
        LambdaQueryWrapper<Payable> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Payable::getSupplierId, supplierId)
              .ne(Payable::getStatus, 3) // 未结清
              .gt(Payable::getPendingAmount, BigDecimal.ZERO) // 有待付金额
              .orderByAsc(Payable::getDueDate) // 按到期日期FIFO
              .orderByAsc(Payable::getCreateTime); // 同日期按创建时间

        List<Payable> payables = this.list(wrapper);

        BigDecimal remainingAmount = totalPaymentAmount;
        BigDecimal totalWriteoffAmount = BigDecimal.ZERO;

        for (Payable payable : payables) {
            if (remainingAmount.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            // 计算本次核销金额
            BigDecimal writeoffAmount = remainingAmount.compareTo(payable.getPendingAmount()) >= 0
                    ? payable.getPendingAmount() : remainingAmount;

            // 更新应付
            payable.setPaidAmount(payable.getPaidAmount().add(writeoffAmount));
            payable.setPendingAmount(payable.getTotalAmount().subtract(payable.getPaidAmount()));
            payable.setUpdateTime(LocalDateTime.now());

            if (payable.getPendingAmount().compareTo(BigDecimal.ZERO) <= 0) {
                payable.setStatus(3); // 已结清
                payable.setPendingAmount(BigDecimal.ZERO);
            } else {
                payable.setStatus(2); // 部分付款
            }
            this.updateById(payable);

            // 保存核销记录
            WriteoffRecord record = new WriteoffRecord();
            record.setWriteoffNo(orderNoGenerator.generateWriteoffNo());
            record.setWriteoffType("PAYABLE");
            record.setSourceId(String.valueOf(payable.getId()));
            record.setSourceNo(payable.getOrderNo());
            record.setTargetId(String.valueOf(paymentId));
            record.setAmount(writeoffAmount);
            record.setWriteoffTime(LocalDateTime.now());
            record.setStatus(1);
            writeoffRecordMapper.insert(record);

            remainingAmount = remainingAmount.subtract(writeoffAmount);
            totalWriteoffAmount = totalWriteoffAmount.add(writeoffAmount);
        }

        return totalWriteoffAmount;
    }

    @Override
    public List<Payable> listBySupplier(Long supplierId) {
        LambdaQueryWrapper<Payable> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Payable::getSupplierId, supplierId)
              .ne(Payable::getStatus, 3) // 排除已结清
              .orderByDesc(Payable::getId);
        return this.list(wrapper);
    }

    @Override
    public List<Payable> getAgingAnalysis(LocalDate startDate, LocalDate endDate) {
        LambdaQueryWrapper<Payable> wrapper = new LambdaQueryWrapper<>();
        wrapper.ge(startDate != null, Payable::getDueDate, startDate)
              .le(endDate != null, Payable::getDueDate, endDate)
              .ne(Payable::getStatus, 3) // 排除已结清
              .orderByAsc(Payable::getDueDate);
        List<Payable> list = this.list(wrapper);
        // 计算逾期天数
        LocalDate today = LocalDate.now();
        for (Payable p : list) {
            if (p.getDueDate() != null && p.getDueDate().isBefore(today)) {
                p.setOverdueDays((int) java.time.temporal.ChronoUnit.DAYS.between(p.getDueDate(), today));
            } else {
                p.setOverdueDays(0);
            }
        }
        return list;
    }

    @Override
    public BigDecimal getTotalPendingBySupplier(Long supplierId) {
        LambdaQueryWrapper<Payable> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Payable::getSupplierId, supplierId)
              .ne(Payable::getStatus, 3);
        List<Payable> list = this.list(wrapper);
        return list.stream()
            .map(Payable::getPendingAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public SupplierStatementDTO getSupplierStatement(Long supplierId, LocalDate startDate, LocalDate endDate) {
        SupplierStatementDTO statement = new SupplierStatementDTO();
        statement.setSupplierId(supplierId);
        statement.setStartDate(startDate);
        statement.setEndDate(endDate);

        // 获取供应商信息
        com.ims.procurement.entity.Supplier supplier = supplierMapper.selectById(supplierId);
        statement.setSupplierName(supplier != null ? supplier.getSupplierName() : "供应商" + supplierId);

        // 期初应付（截止到startDate之前的所有未结清应付）
        LambdaQueryWrapper<Payable> initWrapper = new LambdaQueryWrapper<>();
        initWrapper.eq(Payable::getSupplierId, supplierId)
                  .lt(Payable::getDueDate, startDate)
                  .ne(Payable::getStatus, 3);
        List<Payable> initialPayables = this.list(initWrapper);
        BigDecimal initialPayable = initialPayables.stream()
            .map(Payable::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal initialPaid = initialPayables.stream()
            .map(Payable::getPaidAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal initialPending = initialPayables.stream()
            .map(Payable::getPendingAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        statement.setInitialPayable(initialPayable);
        statement.setInitialPaid(initialPaid);
        statement.setInitialPending(initialPending);

        // 本期新增应付
        LambdaQueryWrapper<Payable> periodWrapper = new LambdaQueryWrapper<>();
        periodWrapper.eq(Payable::getSupplierId, supplierId)
                    .ge(Payable::getDueDate, startDate)
                    .le(Payable::getDueDate, endDate);
        List<Payable> periodPayables = this.list(periodWrapper);
        BigDecimal periodNewPayable = periodPayables.stream()
            .map(Payable::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        statement.setPeriodNewPayable(periodNewPayable);

        // 本期付款（从finance_out表查询，排除预付款）
        LambdaQueryWrapper<FinanceOut> paymentWrapper = new LambdaQueryWrapper<>();
        paymentWrapper.eq(FinanceOut::getSupplierId, supplierId)
                     .eq(FinanceOut::getStatus, 2) // 已审核
                     .eq(FinanceOut::getPaymentType, 1) // 采购付款（非预付款）
                     .ge(FinanceOut::getPayDate, startDate.atStartOfDay())
                     .le(FinanceOut::getPayDate, endDate.plusDays(1).atStartOfDay());
        List<FinanceOut> payments = financeOutMapper.selectList(paymentWrapper);
        BigDecimal periodPaid = payments.stream()
            .map(FinanceOut::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        statement.setPeriodPaid(periodPaid);

        // 期末应付
        statement.setFinalPayable(initialPayable.add(periodNewPayable));
        statement.setFinalPaid(initialPaid.add(periodPaid));
        statement.setFinalPending(initialPending.add(periodNewPayable).subtract(periodPaid));

        // 应付明细
        List<SupplierStatementDTO.PayableDetail> payableDetails = periodPayables.stream().map(p -> {
            SupplierStatementDTO.PayableDetail detail = new SupplierStatementDTO.PayableDetail();
            detail.setOrderNo(p.getOrderNo());
            detail.setDueDate(p.getDueDate());
            detail.setTotalAmount(p.getTotalAmount());
            detail.setPaidAmount(p.getPaidAmount());
            detail.setPendingAmount(p.getPendingAmount());
            detail.setOverdueDays(p.getOverdueDays());
            detail.setStatus(p.getStatus() == 1 ? "未结清" : p.getStatus() == 2 ? "部分付款" : "已结清");
            return detail;
        }).toList();
        statement.setPayables(payableDetails);

        // 付款明细
        List<SupplierStatementDTO.PaymentDetail> paymentDetails = payments.stream().map(p -> {
            SupplierStatementDTO.PaymentDetail detail = new SupplierStatementDTO.PaymentDetail();
            detail.setPaymentNo(p.getOutNo());
            detail.setPaymentDate(p.getPayDate());
            detail.setAmount(p.getAmount());
            detail.setPayMethod(getPayMethodName(p.getPayMethod()));
            detail.setRemark(p.getRemark());
            return detail;
        }).toList();
        statement.setPayments(paymentDetails);

        return statement;
    }

    private String getPayMethodName(Integer payMethod) {
        if (payMethod == null) return "";
        return switch (payMethod) {
            case 1 -> "现金";
            case 2 -> "银行转账";
            case 3 -> "支付宝";
            case 4 -> "微信";
            case 5 -> "其他";
            default -> "未知";
        };
    }

    @Override
    public List<Payable> getOverduePayables(Integer overdueDays) {
        LocalDate today = LocalDate.now();
        LocalDate overdueDate = today.minusDays(overdueDays);
        LambdaQueryWrapper<Payable> wrapper = new LambdaQueryWrapper<>();
        wrapper.lt(Payable::getDueDate, overdueDate)
              .ne(Payable::getStatus, 3) // 排除已结清
              .gt(Payable::getPendingAmount, BigDecimal.ZERO) // 有待付金额
              .orderByAsc(Payable::getDueDate);
        List<Payable> list = this.list(wrapper);
        // 计算逾期天数
        for (Payable p : list) {
            if (p.getDueDate() != null) {
                p.setOverdueDays((int) java.time.temporal.ChronoUnit.DAYS.between(p.getDueDate(), today));
            } else {
                p.setOverdueDays(0);
            }
        }
        return list;
    }

    @Override
    public List<Payable> getDueSoonPayables(Integer days) {
        LocalDate today = LocalDate.now();
        LocalDate dueSoonDate = today.plusDays(days);
        LambdaQueryWrapper<Payable> wrapper = new LambdaQueryWrapper<>();
        wrapper.le(Payable::getDueDate, dueSoonDate)
              .gt(Payable::getDueDate, today) // 未来N天内到期
              .ne(Payable::getStatus, 3) // 排除已结清
              .gt(Payable::getPendingAmount, BigDecimal.ZERO) // 有待付金额
              .orderByAsc(Payable::getDueDate);
        List<Payable> list = this.list(wrapper);
        // 计算到期天数
        for (Payable p : list) {
            if (p.getDueDate() != null) {
                p.setOverdueDays((int) java.time.temporal.ChronoUnit.DAYS.between(today, p.getDueDate()));
            } else {
                p.setOverdueDays(0);
            }
        }
        return list;
    }
}