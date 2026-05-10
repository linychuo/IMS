package com.ims.sales.mapper;

import com.ims.sales.entity.SalesOrderDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SalesOrderDetailMapper {

    SalesOrderDetail selectById(@Param("id") Long id);

    List<SalesOrderDetail> selectByOrderId(@Param("orderId") Long orderId);

    List<SalesOrderDetail> selectByOrderNo(@Param("orderNo") String orderNo);

    int insert(SalesOrderDetail entity);

    int batchInsert(List<SalesOrderDetail> entities);

    int update(SalesOrderDetail entity);

    int deleteByOrderId(@Param("orderId") Long orderId);
}