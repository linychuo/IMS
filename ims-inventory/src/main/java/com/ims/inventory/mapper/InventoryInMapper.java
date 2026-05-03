package com.ims.inventory.mapper;

import com.ims.inventory.entity.InventoryIn;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 入库单Mapper
 */
@Mapper
public interface InventoryInMapper {
    
    InventoryIn selectById(@Param("id") Long id);
    
    List<InventoryIn> selectList(InventoryIn inventoryIn);
    
    InventoryIn selectByInNo(@Param("inNo") String inNo);
    
    int insert(InventoryIn inventoryIn);
    
    int update(InventoryIn inventoryIn);
    
    int deleteById(@Param("id") Long id);
}