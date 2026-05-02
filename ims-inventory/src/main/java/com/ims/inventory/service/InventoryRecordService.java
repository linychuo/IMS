package com.ims.inventory.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.core.dto.PageResult;
import com.ims.inventory.entity.InventoryRecord;

import java.util.List;

/**
 * 库存变动记录 Service
 */
public interface InventoryRecordService extends IService<InventoryRecord> {
    
    /**
     * 分页查询变动记录
     */
    PageResult<InventoryRecord> pageRecord(Long page, Long pageSize, Long productId, 
                                         Long warehouseId, String changeType);
    
    /**
     * 查询单据关联的变动记录
     */
    List<InventoryRecord> getByOrder(String orderType, Long orderId);
}