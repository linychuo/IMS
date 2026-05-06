package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryCheckDetail;
import org.apache.ibatis.annotations.Mapper;

/**
 * 库存盘点明细 Mapper
 */
@Mapper
public interface InventoryCheckDetailMapper extends BaseMapper<InventoryCheckDetail> {
}