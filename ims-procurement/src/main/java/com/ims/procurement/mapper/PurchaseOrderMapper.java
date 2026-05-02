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

    /**
     * 根据ID查询
     */
    PurchaseOrder selectById(@Param("id") String id);

    /**
     * 根据订单编号查询
     */
    PurchaseOrder selectByOrderNo(@Param("orderNo") String orderNo);

    /**
     * 查询列表
     */
    List<PurchaseOrder> selectList(PurchaseOrder query);

    /**
     * 新增
     */
    int insert(PurchaseOrder entity);

    /**
     * 更新
     */
    int update(PurchaseOrder entity);

    /**
     * 删除
     */
    int deleteById(@Param("id") String id);
}