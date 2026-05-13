package com.ims.inventory.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.inventory.entity.InventoryRecord;

import java.util.List;

/**
 * 库存变动记录 Service
 */
public interface InventoryRecordService extends IService<InventoryRecord> {

    /**
     * 分页查询变动记录
     */
    List<InventoryRecord> selectPage(Long productId, Long warehouseId, String changeType, Long pageSize, Long offset);

    /**
     * 查询变动记录总数
     */
    long selectCount(Long productId, Long warehouseId, String changeType);

    /**
     * 根据单据查询变动记录
     */
    List<InventoryRecord> getByOrder(String orderType, Long orderId);
}