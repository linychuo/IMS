package com.ims.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.system.entity.SysNotification;
import com.ims.system.mapper.SysNotificationMapper;
import com.ims.system.service.SysNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 系统通知服务实现
 */
@Service
public class SysNotificationServiceImpl implements SysNotificationService {

    @Autowired
    private SysNotificationMapper notificationMapper;

    @Override
    public IPage<SysNotification> page(Integer page, Integer pageSize) {
        Page<SysNotification> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<SysNotification> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(SysNotification::getId);
        return notificationMapper.selectPage(pageParam, wrapper);
    }

    @Override
    public SysNotification getById(Long id) {
        return notificationMapper.selectById(id);
    }

    @Override
    @Transactional
    public boolean create(SysNotification notification) {
        notification.setCreateTime(LocalDateTime.now());
        notification.setStatus(1);
        notification.setReadCount(0);
        return notificationMapper.insert(notification) > 0;
    }

    @Override
    @Transactional
    public boolean update(SysNotification notification) {
        notification.setUpdateTime(LocalDateTime.now());
        return notificationMapper.updateById(notification) > 0;
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        return notificationMapper.deleteById(id) > 0;
    }

    @Override
    @Transactional
    public boolean markRead(Long id) {
        SysNotification notification = notificationMapper.selectById(id);
        if (notification != null) {
            notification.setReadCount(notification.getReadCount() == null ? 1 : notification.getReadCount() + 1);
            return notificationMapper.updateById(notification) > 0;
        }
        return false;
    }
}