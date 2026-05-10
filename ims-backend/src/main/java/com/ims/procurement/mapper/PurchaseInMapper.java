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

    PurchaseIn selectById(@Param("id") Long id);

    PurchaseIn selectByInNo(@Param("inNo") String inNo);

    List<PurchaseIn> selectList(PurchaseIn query);

    int insert(PurchaseIn entity);

    int update(PurchaseIn entity);

    int deleteById(@Param("id") Long id);
}