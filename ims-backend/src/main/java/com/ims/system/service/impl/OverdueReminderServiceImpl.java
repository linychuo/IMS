package com.ims.system.service.impl;

import com.ims.finance.entity.Payable;
import com.ims.finance.entity.Receivable;
import com.ims.finance.service.PayableService;
import com.ims.finance.service.ReceivableService;
import com.ims.system.entity.SysNotification;
import com.ims.system.entity.SysUser;
import com.ims.system.mapper.SysUserMapper;
import com.ims.system.service.OverdueReminderService;
import com.ims.system.service.SysNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * 逾期预警服务实现
 */
@Service
public class OverdueReminderServiceImpl implements OverdueReminderService {

    @Autowired
    private ReceivableService receivableService;

    @Autowired
    private PayableService payableService;

    @Autowired
    private SysNotificationService notificationService;

    @Autowired
    private SysUserMapper userMapper;

    private static final int OVERDUE_DAYS = 1; // 逾期超过N天发送预警

    @Override
    @Transactional
    public int executeOverdueCheck() {
        // 1. 查询所有逾期应收
        List<Receivable> overdueReceivables = receivableService.getOverdueReceivables(OVERDUE_DAYS);
        // 2. 查询所有逾期应付
        List<Payable> overduePayables = payableService.getOverduePayables(OVERDUE_DAYS);

        if (overdueReceivables.isEmpty() && overduePayables.isEmpty()) {
            return 0; // 没有逾期记录，不发送通知
        }

        // 3. 汇总逾期金额
        BigDecimal totalReceivableOverdue = overdueReceivables.stream()
            .map(Receivable::getPendingAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPayableOverdue = overduePayables.stream()
            .map(Payable::getPendingAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 4. 按客户/供应商分组统计
        String receivableSummary = buildReceivableSummary(overdueReceivables);
        String payableSummary = buildPayableSummary(overduePayables);

        // 5. 发送给所有启用用户
        List<SysUser> notifyUsers = userMapper.selectAllEnabled();
        int notificationCount = 0;

        for (SysUser user : notifyUsers) {
            // 应收逾期通知
            if (!overdueReceivables.isEmpty()) {
                SysNotification receivableNotification = new SysNotification();
                receivableNotification.setTitle("【逾期提醒】客户应收逾期");
                receivableNotification.setContent(String.format(
                    "您有 %d 笔客户应收已逾期，逾期总额 ¥%s。\n主要逾期客户：\n%s\n请及时跟进处理。",
                    overdueReceivables.size(),
                    totalReceivableOverdue.toString(),
                    receivableSummary
                ));
                receivableNotification.setNotifyType(4); // 财务提醒
                receivableNotification.setPriority(overdueReceivables.size() > 10 ? 1 : 2);
                receivableNotification.setTargetType(1); // 指定用户
                receivableNotification.setTargetScope(String.valueOf(user.getId()));
                receivableNotification.setStatus(1);
                receivableNotification.setCreatorId(user.getId());
                receivableNotification.setCreatorName(user.getRealName());
                notificationService.create(receivableNotification);
                notificationCount++;
            }

            // 应付逾期通知
            if (!overduePayables.isEmpty()) {
                SysNotification payableNotification = new SysNotification();
                payableNotification.setTitle("【逾期提醒】供应商应付逾期");
                payableNotification.setContent(String.format(
                    "您有 %d 笔供应商应付已逾期，逾期总额 ¥%s。\n主要逾期供应商：\n%s\n请及时处理付款。",
                    overduePayables.size(),
                    totalPayableOverdue.toString(),
                    payableSummary
                ));
                payableNotification.setNotifyType(4); // 财务提醒
                payableNotification.setPriority(overduePayables.size() > 10 ? 1 : 2);
                payableNotification.setTargetType(1); // 指定用户
                payableNotification.setTargetScope(String.valueOf(user.getId()));
                payableNotification.setStatus(1);
                payableNotification.setCreatorId(user.getId());
                payableNotification.setCreatorName(user.getRealName());
                notificationService.create(payableNotification);
                notificationCount++;
            }
        }

        return notificationCount;
    }

    private String buildReceivableSummary(List<Receivable> receivables) {
        StringBuilder sb = new StringBuilder();
        receivables.stream()
            .collect(java.util.stream.Collectors.groupingBy(Receivable::getCustomerName))
            .forEach((customerName, list) -> {
                Receivable maxOverdue = list.stream()
                    .max((a, b) -> a.getPendingAmount().compareTo(b.getPendingAmount()))
                    .orElse(list.get(0));
                sb.append(String.format("  • %s: ¥%s (逾期%d天)\n",
                    customerName,
                    maxOverdue.getPendingAmount().toString(),
                    maxOverdue.getOverdueDays()));
            });
        return sb.toString();
    }

    private String buildPayableSummary(List<Payable> payables) {
        StringBuilder sb = new StringBuilder();
        payables.stream()
            .collect(java.util.stream.Collectors.groupingBy(Payable::getSupplierName))
            .forEach((supplierName, list) -> {
                Payable maxOverdue = list.stream()
                    .max((a, b) -> a.getPendingAmount().compareTo(b.getPendingAmount()))
                    .orElse(list.get(0));
                sb.append(String.format("  • %s: ¥%s (逾期%d天)\n",
                    supplierName,
                    maxOverdue.getPendingAmount().toString(),
                    maxOverdue.getOverdueDays()));
            });
        return sb.toString();
    }
}