package com.ims.inventory.service;

<<<<<<< HEAD
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
=======
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
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}