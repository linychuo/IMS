package com.ims.sales.mapper;

import com.ims.sales.entity.SalesOrderDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 销售订单明细 Mapper
 */
@Mapper
public interface SalesOrderDetailMapper {

    /**
     * 根据ID查询
     */
    SalesOrderDetail selectById(@Param("id") String id);

    /**
     * 根据订单ID查询明细
     */
    List<SalesOrderDetail> selectByOrderId(@Param("orderId") String orderId);

    /**
     * 根据订单号查询明细
     */
    List<SalesOrderDetail> selectByOrderNo(@Param("orderNo") String orderNo);

    /**
     * 新增
     */
    int insert(SalesOrderDetail entity);

    /**
     * 批量新增
     */
    int batchInsert(List<SalesOrderDetail> entities);

    /**
     * 更新
     */
    int update(SalesOrderDetail entity);

    /**
     * 删除
     */
    int deleteByOrderId(@Param("orderId") String orderId);
}