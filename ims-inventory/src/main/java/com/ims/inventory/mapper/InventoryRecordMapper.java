package com.ims.inventory.mapper;

import com.ims.inventory.entity.InventoryRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 库存变动记录Mapper
 */
@Mapper
public interface InventoryRecordMapper {
    
    InventoryRecord selectById(@Param("id") Long id);
    
    List<InventoryRecord> selectList(InventoryRecord inventoryRecord);
    
    List<InventoryRecord> selectByInventoryId(@Param("inventoryId") Long inventoryId);
    
    List<InventoryRecord> selectByProductId(@Param("productId") Long productId);
    
    int insert(InventoryRecord inventoryRecord);
    
    int deleteById(@Param("id") Long id);
}