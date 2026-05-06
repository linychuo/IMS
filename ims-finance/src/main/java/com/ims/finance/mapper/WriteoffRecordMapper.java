package com.ims.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.finance.entity.WriteoffRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 核销记录 Mapper
 */
@Mapper
public interface WriteoffRecordMapper extends BaseMapper<WriteoffRecord> {
}