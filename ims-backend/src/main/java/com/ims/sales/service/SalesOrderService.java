package com.ims.sales.service;

import com.ims.core.result.PageResult;
import com.ims.sales.entity.SalesOrder;
import com.ims.sales.entity.SalesOrderDetail;
import com.ims.sales.entity.SalesOrderStatusHistory;

import java.util.List;

/**
 * 销售订单服务接口
 */
public interface SalesOrderService {

    /**
     * 创建销售订单
     */
    SalesOrder create(SalesOrder salesOrder, List<SalesOrderDetail> details);

    /**
     * 更新销售订单
     */
    SalesOrder update(Long id, SalesOrder salesOrder, List<SalesOrderDetail> details);

    /**
     * 审核订单
     */
    void approve(Long id, String userId);

    /**
     * 取消订单
     */
    void cancel(Long id, String reason);

    /**
     * 根据ID查询
     */
    SalesOrder getById(Long id);

    /**
     * 根据订单号查询
     */
    SalesOrder getByOrderNo(String orderNo);

    /**
     * 查询订单明细
     */
    List<SalesOrderDetail> getDetails(Long orderId);

    /**
     * 查询列表
     */
    List<SalesOrder> list(SalesOrder query);

    /**
     * 分页查询
     */
    PageResult<SalesOrder> page(Long current, Long size, SalesOrder query);

    /**
     * 删除
     */
    void delete(Long id);

    /**
     * 获取订单状态历史
     */
    List<SalesOrderStatusHistory> getStatusHistory(Long orderId);
}