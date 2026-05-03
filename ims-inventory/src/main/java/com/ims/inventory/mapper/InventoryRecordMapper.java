package com.ims.inventory.mapper;

<<<<<<< HEAD
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
=======
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 库存变动记录 Mapper
 */
@Mapper
public interface InventoryRecordMapper extends BaseMapper<InventoryRecord> {
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}