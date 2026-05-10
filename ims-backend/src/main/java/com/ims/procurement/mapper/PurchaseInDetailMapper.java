package com.ims.procurement.mapper;

import com.ims.procurement.entity.PurchaseInDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 采购入库明细 Mapper
 */
@Mapper
public interface PurchaseInDetailMapper {

    /**
     * 根据ID查询
     */
    PurchaseInDetail selectById(@Param("id") String id);

    /**
     * 根据入库单ID查询明细列表
     */
    List<PurchaseInDetail> selectByInId(@Param("inId") String inId);

    /**
     * 新增
     */
    int insert(PurchaseInDetail entity);

    /**
     * 更新
     */
    int update(PurchaseInDetail entity);

    /**
     * 删除
     */
    int deleteById(@Param("id") String id);

    /**
     * 根据入库单ID删除
     */
    int deleteByInId(@Param("inId") String inId);
}