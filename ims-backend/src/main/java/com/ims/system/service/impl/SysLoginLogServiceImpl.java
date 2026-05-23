package com.ims.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ims.system.entity.SysLoginLog;
import com.ims.system.mapper.SysLoginLogMapper;
import com.ims.system.service.SysLoginLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 登录日志服务实现
 */
@Service
public class SysLoginLogServiceImpl implements SysLoginLogService {

    @Autowired
    private SysLoginLogMapper loginLogMapper;

    @Override
    @Async
    public void loginSuccess(String username, String realName, String loginIp, String device, String browser, String os) {
        SysLoginLog log = new SysLoginLog();
        log.setUsername(username);
        log.setRealName(realName);
        log.setLoginIp(loginIp);
        log.setDevice(device);
        log.setBrowser(browser);
        log.setOs(os);
        log.setLoginStatus(1);
        log.setLoginTime(LocalDateTime.now());
        loginLogMapper.insert(log);
    }

    @Override
    @Async
    public void loginFail(String username, String loginIp, String device, String failReason) {
        SysLoginLog log = new SysLoginLog();
        log.setUsername(username);
        log.setLoginIp(loginIp);
        log.setDevice(device);
        log.setLoginStatus(0);
        log.setFailReason(failReason);
        log.setLoginTime(LocalDateTime.now());
        loginLogMapper.insert(log);
    }

    @Override
    public List<SysLoginLog> page(int page, int pageSize, String username, String startTime, String endTime) {
        LambdaQueryWrapper<SysLoginLog> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(username != null, SysLoginLog::getUsername, username)
                .ge(startTime != null, SysLoginLog::getLoginTime, startTime)
                .le(endTime != null, SysLoginLog::getLoginTime, endTime)
                .orderByDesc(SysLoginLog::getLoginTime);
        wrapper.last("LIMIT " + (page - 1) * pageSize + "," + pageSize);
        return loginLogMapper.selectList(wrapper);
    }

    @Override
    public long countByUsername(String username) {
        LambdaQueryWrapper<SysLoginLog> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(username != null, SysLoginLog::getUsername, username);
        return loginLogMapper.selectCount(wrapper);
    }
}