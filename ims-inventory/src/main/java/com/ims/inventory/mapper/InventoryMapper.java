package com.ims.inventory.mapper;

import com.ims.inventory.entity.Inventory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 库存台账Mapper
 */
@Mapper
public interface InventoryMapper {
    
    Inventory selectById(@Param("id") Long id);
    
    List<Inventory> selectList(Inventory inventory);
    
    List<Inventory> selectByProductId(@Param("productId") Long productId);
    
    List<Inventory> selectByWarehouseId(@Param("warehouseId") Long warehouseId);
    
    Inventory selectByProductAndWarehouse(@Param("productId") Long productId, @Param("warehouseId") Long warehouseId);
    
    int insert(Inventory inventory);
    
    int update(Inventory inventory);
    
    int deleteById(@Param("id") Long id);
}