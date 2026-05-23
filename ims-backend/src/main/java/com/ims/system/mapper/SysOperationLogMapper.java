package com.ims.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.system.entity.SysOperationLog;
import org.apache.ibatis.annotations.Mapper;

/**
 * 操作日志Mapper
 */
@Mapper
public interface SysOperationLogMapper extends BaseMapper<SysOperationLog> {
}