package com.ims.inventory.service;

import com.ims.inventory.entity.InventoryRecord;
import java.util.List;

/**
 * 库存变动记录服务接口
 */
public interface InventoryRecordService {

    /**
     * 创建变动记录
     */
    InventoryRecord create(InventoryRecord record);

    /**
     * 根据ID查询
     */
    InventoryRecord getById(String id);

    /**
     * 根据库存ID查询
     */
    List<InventoryRecord> listByInventoryId(String inventoryId);

    /**
     * 根据商品ID查询
     */
    List<InventoryRecord> listByProductId(String productId);

    /**
     * 查询列表
     */
    List<InventoryRecord> list(InventoryRecord query);
}