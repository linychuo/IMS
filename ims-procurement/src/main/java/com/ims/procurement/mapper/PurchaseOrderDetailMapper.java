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

    /**
     * 根据ID查询
     */
    PurchaseOrderDetail selectById(@Param("id") String id);

    /**
     * 根据订单ID查询明细列表
     */
    List<PurchaseOrderDetail> selectByOrderId(@Param("orderId") String orderId);

    /**
     * 新增
     */
    int insert(PurchaseOrderDetail entity);

    /**
     * 更新
     */
    int update(PurchaseOrderDetail entity);

    /**
     * 删除
     */
    int deleteById(@Param("id") String id);

    /**
     * 根据订单ID删除
     */
    int deleteByOrderId(@Param("orderId") String orderId);
}