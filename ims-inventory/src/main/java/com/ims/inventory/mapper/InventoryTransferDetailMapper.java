package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryTransferDetail;
import org.apache.ibatis.annotations.Mapper;

/**
 * 库存调拨明细 Mapper
 */
@Mapper
public interface InventoryTransferDetailMapper extends BaseMapper<InventoryTransferDetail> {
}