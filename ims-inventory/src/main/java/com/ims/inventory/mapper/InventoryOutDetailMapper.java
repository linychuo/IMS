package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryOutDetail;
import org.apache.ibatis.annotations.Mapper;

/**
 * 出库明细 Mapper
 */
@Mapper
public interface InventoryOutDetailMapper extends BaseMapper<InventoryOutDetail> {
}