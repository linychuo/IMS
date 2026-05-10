package com.ims.procurement.mapper;

import com.ims.procurement.entity.PurchaseOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 采购订单 Mapper
 */
@Mapper
public interface PurchaseOrderMapper {

    PurchaseOrder selectById(@Param("id") Long id);

    PurchaseOrder selectByOrderNo(@Param("orderNo") String orderNo);

    List<PurchaseOrder> selectList(@Param("query") PurchaseOrder query);

    int insert(PurchaseOrder entity);

    int update(PurchaseOrder entity);

    int deleteById(@Param("id") Long id);
}