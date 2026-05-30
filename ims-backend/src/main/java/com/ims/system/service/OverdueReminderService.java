package com.ims.system.service;

import java.util.List;

/**
 * 逾期预警服务接口
 */
public interface OverdueReminderService {

    /**
     * 执行逾期检查并发送通知
     * @return 发送的通知数量
     */
    int executeOverdueCheck();
}