package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryIn;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 入库单 Mapper
 */
@Mapper
public interface InventoryInMapper extends BaseMapper<InventoryIn> {

    List<InventoryIn> selectPage(@Param("warehouseId") Long warehouseId,
                                  @Param("inType") Integer inType,
                                  @Param("status") Integer status,
                                  @Param("pageSize") Long pageSize,
                                  @Param("offset") Long offset);

    long selectCount(@Param("warehouseId") Long warehouseId,
                     @Param("inType") Integer inType,
                     @Param("status") Integer status);
}