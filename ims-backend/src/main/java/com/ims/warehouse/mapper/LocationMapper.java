package com.ims.warehouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.warehouse.entity.Location;
import org.apache.ibatis.annotations.Mapper;

/**
 * 库位Mapper
 */
@Mapper
public interface LocationMapper extends BaseMapper<Location> {
}