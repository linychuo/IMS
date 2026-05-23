package com.ims.sales.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.sales.entity.SalesOrderStatusHistory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 销售订单状态历史 Mapper
 */
@Mapper
public interface SalesOrderStatusHistoryMapper extends BaseMapper<SalesOrderStatusHistory> {

    /**
     * 根据订单ID查询状态历史
     */
    List<SalesOrderStatusHistory> selectByOrderId(@Param("orderId") Long orderId);
}