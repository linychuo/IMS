package com.ims.inventory.mapper;

import com.ims.inventory.entity.InventoryOut;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 出库单Mapper
 */
@Mapper
public interface InventoryOutMapper {
    
    InventoryOut selectById(@Param("id") Long id);
    
    List<InventoryOut> selectList(InventoryOut inventoryOut);
    
    InventoryOut selectByOutNo(@Param("outNo") String outNo);
    
    int insert(InventoryOut inventoryOut);
    
    int update(InventoryOut inventoryOut);
    
    int deleteById(@Param("id") Long id);
}