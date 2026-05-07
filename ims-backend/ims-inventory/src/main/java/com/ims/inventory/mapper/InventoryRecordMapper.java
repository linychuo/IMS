package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 库存变动记录 Mapper
 */
@Mapper
public interface InventoryRecordMapper extends BaseMapper<InventoryRecord> {
}