package com.ims.system.task;

import com.ims.system.service.OverdueReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 逾期预警定时任务
 * 每天早上9点检查逾期应收应付，并发送通知提醒
 */
@Component
public class OverdueNotificationTask {

    @Autowired
    private OverdueReminderService overdueReminderService;

    /**
     * 每天早上9点执行逾期预警检查
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void checkOverdueItems() {
        overdueReminderService.executeOverdueCheck();
    }
}