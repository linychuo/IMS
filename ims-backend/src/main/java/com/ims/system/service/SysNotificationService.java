package com.ims.system.service;

import com.ims.system.entity.SysNotification;
import com.baomidou.mybatisplus.core.metadata.IPage;

/**
 * 系统通知服务接口
 */
public interface SysNotificationService {

    /**
     * 分页查询
     */
    IPage<SysNotification> page(Integer page, Integer pageSize);

    /**
     * 获取详情
     */
    SysNotification getById(Long id);

    /**
     * 创建通知
     */
    boolean create(SysNotification notification);

    /**
     * 更新通知
     */
    boolean update(SysNotification notification);

    /**
     * 删除通知
     */
    boolean delete(Long id);

    /**
     * 标记已读
     */
    boolean markRead(Long id);
}