package com.ims.inventory.mapper;

<<<<<<< HEAD
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
=======
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.Inventory;
import org.apache.ibatis.annotations.Mapper;

/**
 * 库存台账 Mapper
 */
@Mapper
public interface InventoryMapper extends BaseMapper<Inventory> {
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}