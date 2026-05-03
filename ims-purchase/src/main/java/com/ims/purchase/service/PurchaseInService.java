package com.ims.purchase.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.purchase.entity.PurchaseIn;

/**
 * 采购入库Service
 */
public interface PurchaseInService extends IService<PurchaseIn> {
    
    /**
     * 审核入库单（入库）
     */
    boolean auditIn(Long id, String operator);
    
    /**
     * 取消入库单
     */
    boolean cancel(Long id, String reason);
}