package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryCheck;
import org.apache.ibatis.annotations.Mapper;

/**
 * 库存盘点 Mapper
 */
@Mapper
public interface InventoryCheckMapper extends BaseMapper<InventoryCheck> {
}