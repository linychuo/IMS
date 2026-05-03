package com.ims.inventory.mapper;

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
}