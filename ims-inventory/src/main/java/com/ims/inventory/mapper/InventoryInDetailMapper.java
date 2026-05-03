package com.ims.inventory.mapper;

<<<<<<< HEAD
import com.ims.inventory.entity.InventoryInDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 入库单明细Mapper
 */
@Mapper
public interface InventoryInDetailMapper {
    
    InventoryInDetail selectById(@Param("id") Long id);
    
    List<InventoryInDetail> selectByInId(@Param("inId") Long inId);
    
    int insert(InventoryInDetail inventoryInDetail);
    
    int insertBatch(@Param("list") List<InventoryInDetail> list);
    
    int update(InventoryInDetail inventoryInDetail);
    
    int deleteById(@Param("id") Long id);
    
    int deleteByInId(@Param("inId") Long inId);
=======
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.inventory.entity.InventoryInDetail;
import org.apache.ibatis.annotations.Mapper;

/**
 * 入库明细 Mapper
 */
@Mapper
public interface InventoryInDetailMapper extends BaseMapper<InventoryInDetail> {
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}