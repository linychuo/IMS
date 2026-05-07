package com.ims.warehouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.warehouse.entity.Warehouse;
import org.apache.ibatis.annotations.Mapper;

/**
 * 仓库Mapper
 */
@Mapper
public interface WarehouseMapper extends BaseMapper<Warehouse> {
}