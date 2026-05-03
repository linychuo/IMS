package com.ims.purchase.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.purchase.entity.PurchaseOrder;

/**
 * 采购订单Service
 */
public interface PurchaseOrderService extends IService<PurchaseOrder> {
    
    /**
     * 确认采购订单
     */
    boolean confirm(Long id);
    
    /**
     * 取消采购订单
     */
    boolean cancel(Long id, String reason);
    
    /**
     * 完成采购订单
     */
    boolean complete(Long id);
}