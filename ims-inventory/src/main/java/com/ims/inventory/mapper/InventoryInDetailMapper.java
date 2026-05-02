package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryInDetail;
import org.apache.ibatis.annotations.Mapper;

/**
 * 入库明细 Mapper
 */
@Mapper
public interface InventoryInDetailMapper extends BaseMapper<InventoryInDetail> {
}