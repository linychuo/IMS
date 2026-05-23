package com.ims.finance.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.common.util.OrderNoGenerator;
import com.ims.core.result.PageResult;
import com.ims.finance.dto.CustomerStatementDTO;
import com.ims.finance.entity.Receivable;
import com.ims.finance.entity.WriteoffRecord;
import com.ims.finance.mapper.ReceivableMapper;
import com.ims.finance.mapper.WriteoffRecordMapper;
import com.ims.finance.service.ReceivableService;
import com.ims.finance.mapper.FinanceInMapper;
import com.ims.finance.entity.FinanceIn;
import com.ims.customer.mapper.CustomerMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 应收账款 Service 实现
 */
@Service
public class ReceivableServiceImpl extends ServiceImpl<ReceivableMapper, Receivable> implements ReceivableService {

    @Autowired
    private WriteoffRecordMapper writeoffRecordMapper;
    @Autowired
    private OrderNoGenerator orderNoGenerator;
    @Autowired
    private FinanceInMapper financeInMapper;
    @Autowired
    private CustomerMapper customerMapper;

    @Override
    public PageResult<Receivable> page(Long page, Long pageSize, Long customerId, Integer status) {
        LambdaQueryWrapper<Receivable> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(customerId != null, Receivable::getCustomerId, customerId)
              .eq(status != null, Receivable::getStatus, status)
              .orderByDesc(Receivable::getId);
        Page<Receivable> result = this.page(new Page<>(page, pageSize), wrapper);
        return PageResult.of(result);
    }

    @Override
    public Receivable getById(Long id) {
        return this.getById(id);
    }

    @Override
    @Transactional
    public boolean create(Receivable receivable) {
        receivable.setReceivedAmount(BigDecimal.ZERO);
        receivable.setPendingAmount(receivable.getTotalAmount());
        receivable.setStatus(1);
        receivable.setCreateTime(LocalDateTime.now());
        return this.save(receivable);
    }

    @Override
    @Transactional
    public boolean update(Receivable receivable) {
        receivable.setUpdateTime(LocalDateTime.now());
        return this.updateById(receivable);
    }

    @Override
    @Transactional
    public boolean writeoff(Long id, Long receiptId, BigDecimal amount) {
        Receivable receivable = this.getById(id);
        if (receivable == null) {
            return false;
        }
        // 更新已收金额和待收金额
        receivable.setReceivedAmount(receivable.getReceivedAmount().add(amount));
        receivable.setPendingAmount(receivable.getTotalAmount().subtract(receivable.getReceivedAmount()));
        receivable.setUpdateTime(LocalDateTime.now());
        // 更新状态
        if (receivable.getPendingAmount().compareTo(BigDecimal.ZERO) <= 0) {
            receivable.setStatus(3); // 已结清
            receivable.setPendingAmount(BigDecimal.ZERO);
        } else {
            receivable.setStatus(2); // 部分收款
        }
        this.updateById(receivable);

        // 保存核销记录
        WriteoffRecord record = new WriteoffRecord();
        record.setWriteoffNo(orderNoGenerator.generateWriteoffNo());
        record.setWriteoffType("RECEIVABLE");
        record.setSourceId(String.valueOf(id));
        record.setSourceNo(receivable.getOrderNo());
        record.setTargetId(String.valueOf(receiptId));
        record.setAmount(amount);
        record.setWriteoffTime(LocalDateTime.now());
        record.setStatus(1);
        writeoffRecordMapper.insert(record);

        return true;
    }

    @Override
    @Transactional
    public BigDecimal autoWriteoff(Long customerId, Long receiptId, BigDecimal totalReceiptAmount) {
        // 按到期日期升序（先进先出），查询该客户所有未结清的应收
        LambdaQueryWrapper<Receivable> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Receivable::getCustomerId, customerId)
              .ne(Receivable::getStatus, 3) // 未结清
              .gt(Receivable::getPendingAmount, BigDecimal.ZERO) // 有待收金额
              .orderByAsc(Receivable::getDueDate) // 按到期日期FIFO
              .orderByAsc(Receivable::getCreateTime); // 同日期按创建时间

        List<Receivable> receivables = this.list(wrapper);

        BigDecimal remainingAmount = totalReceiptAmount;
        BigDecimal totalWriteoffAmount = BigDecimal.ZERO;

        for (Receivable receivable : receivables) {
            if (remainingAmount.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            // 计算本次核销金额
            BigDecimal writeoffAmount = remainingAmount.compareTo(receivable.getPendingAmount()) >= 0
                    ? receivable.getPendingAmount() : remainingAmount;

            // 更新应收
            receivable.setReceivedAmount(receivable.getReceivedAmount().add(writeoffAmount));
            receivable.setPendingAmount(receivable.getTotalAmount().subtract(receivable.getReceivedAmount()));
            receivable.setUpdateTime(LocalDateTime.now());

            if (receivable.getPendingAmount().compareTo(BigDecimal.ZERO) <= 0) {
                receivable.setStatus(3); // 已结清
                receivable.setPendingAmount(BigDecimal.ZERO);
            } else {
                receivable.setStatus(2); // 部分收款
            }
            this.updateById(receivable);

            // 保存核销记录
            WriteoffRecord record = new WriteoffRecord();
            record.setWriteoffNo(orderNoGenerator.generateWriteoffNo());
            record.setWriteoffType("RECEIVABLE");
            record.setSourceId(String.valueOf(receivable.getId()));
            record.setSourceNo(receivable.getOrderNo());
            record.setTargetId(String.valueOf(receiptId));
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
    public List<Receivable> listByCustomer(Long customerId) {
        LambdaQueryWrapper<Receivable> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Receivable::getCustomerId, customerId)
              .ne(Receivable::getStatus, 3) // 排除已结清
              .orderByDesc(Receivable::getId);
        return this.list(wrapper);
    }

    @Override
    public List<Receivable> getAgingAnalysis(LocalDate startDate, LocalDate endDate) {
        LambdaQueryWrapper<Receivable> wrapper = new LambdaQueryWrapper<>();
        wrapper.ge(startDate != null, Receivable::getDueDate, startDate)
              .le(endDate != null, Receivable::getDueDate, endDate)
              .ne(Receivable::getStatus, 3) // 排除已结清
              .orderByAsc(Receivable::getDueDate);
        List<Receivable> list = this.list(wrapper);
        // 计算逾期天数
        LocalDate today = LocalDate.now();
        for (Receivable r : list) {
            if (r.getDueDate() != null && r.getDueDate().isBefore(today)) {
                r.setOverdueDays((int) java.time.temporal.ChronoUnit.DAYS.between(r.getDueDate(), today));
            } else {
                r.setOverdueDays(0);
            }
        }
        return list;
    }

    @Override
    public BigDecimal getTotalPendingByCustomer(Long customerId) {
        LambdaQueryWrapper<Receivable> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Receivable::getCustomerId, customerId)
              .ne(Receivable::getStatus, 3);
        List<Receivable> list = this.list(wrapper);
        return list.stream()
            .map(Receivable::getPendingAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public CustomerStatementDTO getCustomerStatement(Long customerId, LocalDate startDate, LocalDate endDate) {
        CustomerStatementDTO statement = new CustomerStatementDTO();
        statement.setCustomerId(customerId);
        statement.setStartDate(startDate);
        statement.setEndDate(endDate);

        // 获取客户信息
        com.ims.customer.entity.Customer customer = customerMapper.selectById(customerId);
        statement.setCustomerName(customer != null ? customer.getName() : "客户" + customerId);

        // 期初应收（截止到startDate之前的所有未结清应收）
        LambdaQueryWrapper<Receivable> initWrapper = new LambdaQueryWrapper<>();
        initWrapper.eq(Receivable::getCustomerId, customerId)
                  .lt(Receivable::getDueDate, startDate)
                  .ne(Receivable::getStatus, 3);
        List<Receivable> initialReceivables = this.list(initWrapper);
        BigDecimal initialReceivable = initialReceivables.stream()
            .map(Receivable::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal initialPaid = initialReceivables.stream()
            .map(Receivable::getReceivedAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal initialPending = initialReceivables.stream()
            .map(Receivable::getPendingAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        statement.setInitialReceivable(initialReceivable);
        statement.setInitialPaid(initialPaid);
        statement.setInitialPending(initialPending);

        // 本期新增应收
        LambdaQueryWrapper<Receivable> periodWrapper = new LambdaQueryWrapper<>();
        periodWrapper.eq(Receivable::getCustomerId, customerId)
                    .ge(Receivable::getDueDate, startDate)
                    .le(Receivable::getDueDate, endDate);
        List<Receivable> periodReceivables = this.list(periodWrapper);
        BigDecimal periodNewReceivable = periodReceivables.stream()
            .map(Receivable::getTotalAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        statement.setPeriodNewReceivable(periodNewReceivable);

        // 本期收款（从finance_in表查询，排除预收款）
        LambdaQueryWrapper<FinanceIn> receiptWrapper = new LambdaQueryWrapper<>();
        receiptWrapper.eq(FinanceIn::getCustomerId, customerId)
                     .eq(FinanceIn::getStatus, 2) // 已审核
                     .eq(FinanceIn::getReceiptType, 1) // 销售收款（非预收款）
                     .ge(FinanceIn::getPayDate, startDate.atStartOfDay())
                     .le(FinanceIn::getPayDate, endDate.plusDays(1).atStartOfDay());
        List<FinanceIn> receipts = financeInMapper.selectList(receiptWrapper);
        BigDecimal periodReceived = receipts.stream()
            .map(FinanceIn::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        statement.setPeriodReceived(periodReceived);

        // 期末应收
        statement.setFinalReceivable(initialReceivable.add(periodNewReceivable));
        statement.setFinalPaid(initialPaid.add(periodReceived));
        statement.setFinalPending(initialPending.add(periodNewReceivable).subtract(periodReceived));

        // 应收明细
        List<CustomerStatementDTO.ReceivableDetail> receivableDetails = periodReceivables.stream().map(r -> {
            CustomerStatementDTO.ReceivableDetail detail = new CustomerStatementDTO.ReceivableDetail();
            detail.setOrderNo(r.getOrderNo());
            detail.setDueDate(r.getDueDate());
            detail.setTotalAmount(r.getTotalAmount());
            detail.setPaidAmount(r.getReceivedAmount());
            detail.setPendingAmount(r.getPendingAmount());
            detail.setOverdueDays(r.getOverdueDays());
            detail.setStatus(r.getStatus() == 1 ? "未结清" : r.getStatus() == 2 ? "部分收款" : "已结清");
            return detail;
        }).toList();
        statement.setReceivables(receivableDetails);

        // 收款明细
        List<CustomerStatementDTO.ReceiptDetail> receiptDetails = receipts.stream().map(r -> {
            CustomerStatementDTO.ReceiptDetail detail = new CustomerStatementDTO.ReceiptDetail();
            detail.setReceiptNo(r.getInNo());
            detail.setReceiptDate(r.getPayDate());
            detail.setAmount(r.getAmount());
            detail.setPayMethod(getPayMethodName(r.getPayMethod()));
            detail.setRemark(r.getRemark());
            return detail;
        }).toList();
        statement.setReceipts(receiptDetails);

        return statement;
    }

    @Override
    public List<Receivable> getOverdueReceivables(Integer overdueDays) {
        if (overdueDays == null) {
            overdueDays = 1; // 默认已逾期
        }
        LocalDate threshold = LocalDate.now().minusDays(overdueDays);
        LambdaQueryWrapper<Receivable> wrapper = new LambdaQueryWrapper<>();
        wrapper.lt(Receivable::getDueDate, threshold)
              .ne(Receivable::getStatus, 3) // 排除已结清
              .gt(Receivable::getPendingAmount, BigDecimal.ZERO) // 有待收金额
              .orderByAsc(Receivable::getDueDate);
        List<Receivable> list = this.list(wrapper);
        // 计算逾期天数
        LocalDate today = LocalDate.now();
        for (Receivable r : list) {
            if (r.getDueDate() != null) {
                r.setOverdueDays((int) java.time.temporal.ChronoUnit.DAYS.between(r.getDueDate(), today));
            }
        }
        return list;
    }

    @Override
    public List<Receivable> getDueSoonReceivables(Integer days) {
        if (days == null) {
            days = 7; // 默认7天内
        }
        LocalDate threshold = LocalDate.now().plusDays(days);
        LambdaQueryWrapper<Receivable> wrapper = new LambdaQueryWrapper<>();
        wrapper.le(Receivable::getDueDate, threshold)
              .gt(Receivable::getDueDate, LocalDate.now()) // 还未到期
              .ne(Receivable::getStatus, 3) // 排除已结清
              .orderByAsc(Receivable::getDueDate);
        return this.list(wrapper);
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
}