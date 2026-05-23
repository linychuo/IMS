package com.ims.sales.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.sales.entity.SalesOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 销售订单 Mapper
 */
@Mapper
public interface SalesOrderMapper extends BaseMapper<SalesOrder> {

    /**
     * 根据订单号查询
     */
    SalesOrder selectByOrderNo(@Param("orderNo") String orderNo);

    /**
     * 查询列表
     */
    List<SalesOrder> selectList(SalesOrder query);

    /**
     * 更新
     */
    int update(SalesOrder entity);
}