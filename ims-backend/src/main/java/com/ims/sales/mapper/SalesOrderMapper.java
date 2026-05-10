package com.ims.sales.mapper;

import com.ims.sales.entity.SalesOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 销售订单 Mapper
 */
@Mapper
public interface SalesOrderMapper {

    /**
     * 根据ID查询
     */
    SalesOrder selectById(@Param("id") Long id);

    /**
     * 根据订单号查询
     */
    SalesOrder selectByOrderNo(@Param("orderNo") String orderNo);

    /**
     * 查询列表
     */
    List<SalesOrder> selectList(SalesOrder query);

    /**
     * 新增
     */
    int insert(SalesOrder entity);

    /**
     * 更新
     */
    int update(SalesOrder entity);

    /**
     * 删除
     */
    int deleteById(@Param("id") Long id);
}