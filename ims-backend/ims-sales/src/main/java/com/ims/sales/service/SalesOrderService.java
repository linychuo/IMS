package com.ims.sales.service;

import com.ims.sales.entity.SalesOrder;
import com.ims.sales.entity.SalesOrderDetail;

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
    SalesOrder update(String id, SalesOrder salesOrder, List<SalesOrderDetail> details);

    /**
     * 审核订单
     */
    void approve(String id, String userId);

    /**
     * 取消订单
     */
    void cancel(String id, String reason);

    /**
     * 根据ID查询
     */
    SalesOrder getById(String id);

    /**
     * 根据订单号查询
     */
    SalesOrder getByOrderNo(String orderNo);

    /**
     * 查询订单明细
     */
    List<SalesOrderDetail> getDetails(String orderId);

    /**
     * 查询列表
     */
    List<SalesOrder> list(SalesOrder query);

    /**
     * 删除
     */
    void delete(String id);
}