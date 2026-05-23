package com.ims.system.service;

import com.ims.system.entity.SysOperationLog;
import java.util.List;

/**
 * 操作日志服务接口
 */
public interface SysOperationLogService {

    /**
     * 记录操作日志
     */
    void log(String module, String action, String operator, String operatorIp,
             String requestMethod, String requestUrl, String requestParams,
             String responseResult, Integer responseStatus, Long duration, String errorMessage);

    /**
     * 分页查询日志
     */
    List<SysOperationLog> page(int page, int pageSize, String module, String operator, String startTime, String endTime);

    /**
     * 根据ID查询
     */
    SysOperationLog getById(Long id);

    /**
     * 获取操作统计
     */
    long count(String module, String startTime, String endTime);
}