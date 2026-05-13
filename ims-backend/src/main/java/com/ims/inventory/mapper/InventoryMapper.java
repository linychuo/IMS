package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.Inventory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 库存台账 Mapper
 */
@Mapper
public interface InventoryMapper extends BaseMapper<Inventory> {

    List<Inventory> selectPage(@Param("productId") Long productId,
                               @Param("warehouseId") Long warehouseId,
                               @Param("pageSize") Long pageSize,
                               @Param("offset") Long offset);

    long selectCount(@Param("productId") Long productId,
                     @Param("warehouseId") Long warehouseId);
}