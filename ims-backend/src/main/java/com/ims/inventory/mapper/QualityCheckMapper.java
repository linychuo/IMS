package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.QualityCheck;
import org.apache.ibatis.annotations.Mapper;

/**
 * 质检单 Mapper
 */
@Mapper
public interface QualityCheckMapper extends BaseMapper<QualityCheck> {
}