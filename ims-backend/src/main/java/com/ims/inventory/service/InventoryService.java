package com.ims.inventory.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.inventory.entity.Inventory;

import java.math.BigDecimal;
import java.util.List;

/**
 * 库存台账 Service
 */
public interface InventoryService extends IService<Inventory> {

    /**
     * 分页查询库存
     */
    List<Inventory> selectPage(Long productId, Long warehouseId, Long pageSize, Long offset);

    /**
     * 查询库存总数
     */
    long selectCount(Long productId, Long warehouseId);

    /**
     * 增加库存
     */
    boolean addStock(Long productId, Long warehouseId, Long locationId,
                  BigDecimal quantity, BigDecimal cost,
                  String batchNo, String orderType, Long orderId);

    /**
     * 扣减库存
     */
    boolean reduceStock(Long productId, Long warehouseId, Long locationId,
                       BigDecimal quantity, String batchNo,
                       String orderType, Long orderId);

    /**
     * 按FIFO原则扣减库存（按生产日期升序选择批次）
     * 如果指定批次则用指定批次，否则按FIFO自动选择
     */
    boolean reduceStockByFifo(Long productId, Long warehouseId, Long locationId,
                              BigDecimal quantity, String batchNo,
                              String orderType, Long orderId);

    /**
     * 获取库存批次列表（按生产日期升序，用于FIFO推荐）
     */
    List<Inventory> getInventoryListByProduct(Long productId, Long warehouseId);

    /**
     * 冻结库存
     */
    boolean freezeStock(Long productId, Long warehouseId, BigDecimal quantity);

    /**
     * 解冻库存
     */
    boolean unfreezeStock(Long productId, Long warehouseId, BigDecimal quantity);

    /**
     * 获取可用库存 (库存 - 冻结)
     */
    BigDecimal getAvailableQuantity(Long productId, Long warehouseId);

    /**
     * 获取库存预警列表 (库存低于安全库存)
     */
    List<Inventory> getWarningList();

    /**
     * 获取临期商品预警（有效期≤N天）
     */
    List<Inventory> getExpiringList(Integer days);

    /**
     * 获取呆滞商品（N天未动）
     */
    List<Inventory> getIdleStock(Integer days);

    /**
     * 获取最高库存预警列表（库存高于最高库存）
     */
    List<Inventory> getHighStockList();
}