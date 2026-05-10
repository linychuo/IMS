package com.ims.procurement.mapper;

import com.ims.procurement.entity.PurchaseOrderDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 采购订单明细 Mapper
 */
@Mapper
public interface PurchaseOrderDetailMapper {

    PurchaseOrderDetail selectById(@Param("id") Long id);

    List<PurchaseOrderDetail> selectByOrderId(@Param("orderId") Long orderId);

    int insert(PurchaseOrderDetail entity);

    int update(PurchaseOrderDetail entity);

    int deleteById(@Param("id") Long id);

    int deleteByOrderId(@Param("orderId") Long orderId);
}