package com.ims.inventory.mapper;

<<<<<<< HEAD
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
=======
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryOut;
import org.apache.ibatis.annotations.Mapper;

/**
 * 出库单 Mapper
 */
@Mapper
public interface InventoryOutMapper extends BaseMapper<InventoryOut> {
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}