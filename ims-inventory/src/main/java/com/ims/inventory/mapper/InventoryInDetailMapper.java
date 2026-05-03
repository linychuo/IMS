package com.ims.inventory.mapper;

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
}