package com.ims.inventory.mapper;

<<<<<<< HEAD
import com.ims.inventory.entity.InventoryOutDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 出库单明细Mapper
 */
@Mapper
public interface InventoryOutDetailMapper {
    
    InventoryOutDetail selectById(@Param("id") Long id);
    
    List<InventoryOutDetail> selectByOutId(@Param("outId") Long outId);
    
    int insert(InventoryOutDetail inventoryOutDetail);
    
    int insertBatch(@Param("list") List<InventoryOutDetail> list);
    
    int update(InventoryOutDetail inventoryOutDetail);
    
    int deleteById(@Param("id") Long id);
    
    int deleteByOutId(@Param("outId") Long outId);
=======
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryOutDetail;
import org.apache.ibatis.annotations.Mapper;

/**
 * 出库明细 Mapper
 */
@Mapper
public interface InventoryOutDetailMapper extends BaseMapper<InventoryOutDetail> {
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}