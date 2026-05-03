package com.ims.inventory.service;

import com.ims.inventory.entity.Inventory;
import java.util.List;

/**
 * 库存台账服务接口
 */
public interface InventoryService {

    /**
     * 创建库存记录
     */
    Inventory create(Inventory inventory);

    /**
     * 更新库存
     */
    Inventory update(Inventory inventory);

    /**
     * 增加库存
     */
    void addQuantity(String id, java.math.BigDecimal quantity);

    /**
     * 减少库存
     */
    void reduceQuantity(String id, java.math.BigDecimal quantity);

    /**
     * 根据ID查询
     */
    Inventory getById(String id);

    /**
     * 根据商品ID查询
     */
    List<Inventory> listByProductId(String productId);

    /**
     * 根据仓库ID查询
     */
    List<Inventory> listByWarehouseId(String warehouseId);

    /**
     * 根据商品和仓库查询
     */
    Inventory getByProductAndWarehouse(String productId, String warehouseId);

    /**
     * 查询列表
     */
    List<Inventory> list(Inventory query);

    /**
     * 删除
     */
    void delete(String id);
}