package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.Inventory;
import org.apache.ibatis.annotations.Mapper;

/**
 * 库存台账 Mapper
 */
@Mapper
public interface InventoryMapper extends BaseMapper<Inventory> {
}