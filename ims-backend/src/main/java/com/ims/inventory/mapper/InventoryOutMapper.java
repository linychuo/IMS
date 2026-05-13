package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryOut;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 出库单 Mapper
 */
@Mapper
public interface InventoryOutMapper extends BaseMapper<InventoryOut> {

    List<InventoryOut> selectPage(@Param("warehouseId") Long warehouseId,
                                  @Param("outType") Integer outType,
                                  @Param("status") Integer status,
                                  @Param("pageSize") Long pageSize,
                                  @Param("offset") Long offset);

    long selectCount(@Param("warehouseId") Long warehouseId,
                    @Param("outType") Integer outType,
                    @Param("status") Integer status);
}