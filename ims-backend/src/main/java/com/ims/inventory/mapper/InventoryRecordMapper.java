package com.ims.inventory.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 库存变动记录 Mapper
 */
@Mapper
public interface InventoryRecordMapper extends BaseMapper<InventoryRecord> {

    List<InventoryRecord> selectPage(@Param("productId") Long productId,
                                     @Param("warehouseId") Long warehouseId,
                                     @Param("changeType") String changeType,
                                     @Param("pageSize") Long pageSize,
                                     @Param("offset") Long offset);

    long selectCount(@Param("productId") Long productId,
                    @Param("warehouseId") Long warehouseId,
                    @Param("changeType") String changeType);

    List<InventoryRecord> selectByOrder(@Param("orderType") String orderType,
                                         @Param("orderId") Long orderId);
}