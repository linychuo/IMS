package com.ims.inventory.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.inventory.entity.Inventory;

/**
 * 库存台账 Service
 */
public interface InventoryService extends IService<Inventory> {
    
    /**
     * 增加库存
     */
    boolean addStock(Long productId, Long warehouseId, Long locationId, 
                  java.math.BigDecimal quantity, java.math.BigDecimal cost,
                  String batchNo, String orderType, Long orderId);
    
    /**
     * 扣减库存
     */
    boolean reduceStock(Long productId, Long warehouseId, Long locationId,
                       java.math.BigDecimal quantity, String batchNo,
                       String orderType, Long orderId);
    
    /**
     * 冻结库存
     */
    boolean freezeStock(Long productId, Long warehouseId, java.math.BigDecimal quantity);
    
    /**
     * 解冻库存
     */
    boolean unfreezeStock(Long productId, Long warehouseId, java.math.BigDecimal quantity);
    
    /**
     * 获取可用库存 (库存 - 冻结)
     */
    java.math.BigDecimal getAvailableQuantity(Long productId, Long warehouseId);
}