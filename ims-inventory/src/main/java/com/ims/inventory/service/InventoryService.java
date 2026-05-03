package com.ims.inventory.service;

<<<<<<< HEAD
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
=======
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
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}