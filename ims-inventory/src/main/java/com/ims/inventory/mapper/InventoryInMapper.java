package com.ims.inventory.mapper;

<<<<<<< HEAD
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
=======
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryIn;
import org.apache.ibatis.annotations.Mapper;

/**
 * 入库单 Mapper
 */
@Mapper
public interface InventoryInMapper extends BaseMapper<InventoryIn> {
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}