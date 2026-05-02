package com.ims.procurement.service;

import com.ims.procurement.dto.request.CreatePurchaseOrderRequest;
import com.ims.procurement.dto.request.UpdatePurchaseOrderRequest;
import com.ims.procurement.entity.PurchaseOrder;
import com.ims.procurement.entity.Supplier;

import java.util.List;

/**
 * 采购订单服务接口
 */
public interface PurchaseOrderService {

    /**
     * 创建采购订单
     */
    PurchaseOrder create(CreatePurchaseOrderRequest request);

    /**
     * 更新采购订单
     */
    PurchaseOrder update(String id, UpdatePurchaseOrderRequest request);

    /**
     * 审核采购订单
     */
    void approve(String id, String userId);

    /**
     * 取消采购订单
     */
    void cancel(String id, String reason);

    /**
     * 根据ID查询
     */
    PurchaseOrder getById(String id);

    /**
     * 根据订单号查询
     */
    PurchaseOrder getByOrderNo(String orderNo);

    /**
     * 查询列表
     */
    List<PurchaseOrder> list(PurchaseOrder query);

    /**
     * 删除
     */
    void delete(String id);
}