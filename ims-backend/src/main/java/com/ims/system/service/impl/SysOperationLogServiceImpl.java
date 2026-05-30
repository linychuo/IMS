package com.ims.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ims.system.entity.SysOperationLog;
import com.ims.system.mapper.SysOperationLogMapper;
import com.ims.system.service.SysOperationLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 操作日志服务实现
 */
@Service
public class SysOperationLogServiceImpl implements SysOperationLogService {

    @Autowired
    private SysOperationLogMapper operationLogMapper;

    @Override
    @Async
    public void log(String module, String action, String operator, String operatorIp,
                    String requestMethod, String requestUrl, String requestParams,
                    String responseResult, Integer responseStatus, Long duration, String errorMessage) {
        SysOperationLog log = new SysOperationLog();
        log.setModule(module);
        log.setAction(action);
        log.setOperator(operator);
        log.setOperatorIp(operatorIp);
        log.setRequestMethod(requestMethod);
        log.setRequestUrl(requestUrl);
        log.setRequestParams(requestParams);
        log.setResponseResult(responseResult);
        log.setResponseStatus(responseStatus);
        log.setDuration(duration);
        log.setErrorMessage(errorMessage);
        log.setOperateTime(LocalDateTime.now());
        operationLogMapper.insert(log);
    }

    @Override
    public List<SysOperationLog> page(int page, int pageSize, String module, String operator, String startTime, String endTime) {
        LambdaQueryWrapper<SysOperationLog> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(module != null, SysOperationLog::getModule, module)
                .eq(operator != null, SysOperationLog::getOperator, operator)
                .ge(startTime != null, SysOperationLog::getOperateTime, startTime)
                .le(endTime != null, SysOperationLog::getOperateTime, endTime)
                .orderByDesc(SysOperationLog::getOperateTime);
        wrapper.last("LIMIT " + pageSize + " OFFSET " + (page - 1) * pageSize);
        return operationLogMapper.selectList(wrapper);
    }

    @Override
    public SysOperationLog getById(Long id) {
        return operationLogMapper.selectById(id);
    }

    @Override
    public long count(String module, String startTime, String endTime) {
        LambdaQueryWrapper<SysOperationLog> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(module != null, SysOperationLog::getModule, module)
                .ge(startTime != null, SysOperationLog::getOperateTime, startTime)
                .le(endTime != null, SysOperationLog::getOperateTime, endTime);
        return operationLogMapper.selectCount(wrapper);
    }
}