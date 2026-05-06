package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryOut;
import org.apache.ibatis.annotations.Mapper;

/**
 * 出库单 Mapper
 */
@Mapper
public interface InventoryOutMapper extends BaseMapper<InventoryOut> {
}