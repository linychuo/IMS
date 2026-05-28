package com.ims.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.system.entity.BackupRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 备份记录Mapper
 */
@Mapper
public interface BackupRecordMapper extends BaseMapper<BackupRecord> {
}
