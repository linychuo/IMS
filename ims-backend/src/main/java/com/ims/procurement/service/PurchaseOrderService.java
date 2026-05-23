package com.ims.procurement.service;

import com.ims.procurement.dto.request.CreatePurchaseOrderRequest;
import com.ims.procurement.dto.request.UpdatePurchaseOrderRequest;
import com.ims.procurement.entity.PurchaseOrder;

import java.time.LocalDate;
import java.util.List;

/**
 * 采购订单服务接口
 */
public interface PurchaseOrderService {

    PurchaseOrder create(CreatePurchaseOrderRequest request);

    PurchaseOrder update(Long id, UpdatePurchaseOrderRequest request);

    void approve(Long id, String userId);

    void cancel(Long id, String reason);

    PurchaseOrder getById(Long id);

    PurchaseOrder getByOrderNo(String orderNo);

    List<PurchaseOrder> list(PurchaseOrder query);

    void delete(Long id);

    /**
     * 获取即将到货的订单（N天内）
     */
    List<PurchaseOrder> getIncomingOrders(Integer days);

    /**
     * 获取已逾期未入库的订单
     */
    List<PurchaseOrder> getOverdueOrders();
}