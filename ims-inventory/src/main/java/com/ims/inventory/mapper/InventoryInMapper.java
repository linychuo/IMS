package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryIn;
import org.apache.ibatis.annotations.Mapper;

/**
 * 入库单 Mapper
 */
@Mapper
public interface InventoryInMapper extends BaseMapper<InventoryIn> {
}