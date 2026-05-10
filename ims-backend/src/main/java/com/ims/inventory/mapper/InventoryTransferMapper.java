package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryTransfer;
import org.apache.ibatis.annotations.Mapper;

/**
 * 库存调拨 Mapper
 */
@Mapper
public interface InventoryTransferMapper extends BaseMapper<InventoryTransfer> {
}