package com.ims.procurement.mapper;

import com.ims.procurement.entity.PurchaseIn;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 采购入库单 Mapper
 */
@Mapper
public interface PurchaseInMapper {

    /**
     * 根据ID查询
     */
    PurchaseIn selectById(@Param("id") String id);

    /**
     * 根据入库单号查询
     */
    PurchaseIn selectByInNo(@Param("inNo") String inNo);

    /**
     * 查询列表
     */
    List<PurchaseIn> selectList(PurchaseIn query);

    /**
     * 新增
     */
    int insert(PurchaseIn entity);

    /**
     * 更新
     */
    int update(PurchaseIn entity);

    /**
     * 删除
     */
    int deleteById(@Param("id") String id);
}