package com.ims.system.service;

import com.ims.system.entity.SysLoginLog;
import java.util.List;

/**
 * 登录日志服务接口
 */
public interface SysLoginLogService {

    /**
     * 记录登录成功
     */
    void loginSuccess(String username, String realName, String loginIp, String device, String browser, String os);

    /**
     * 记录登录失败
     */
    void loginFail(String username, String loginIp, String device, String failReason);

    /**
     * 分页查询登录日志
     */
    List<SysLoginLog> page(int page, int pageSize, String username, String startTime, String endTime);

    /**
     * 统计用户登录次数
     */
    long countByUsername(String username);
}