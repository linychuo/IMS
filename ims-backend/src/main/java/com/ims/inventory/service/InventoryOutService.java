package com.ims.inventory.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.core.result.PageResult;
import com.ims.inventory.entity.InventoryOut;
import com.ims.inventory.entity.InventoryOutDetail;

import java.util.List;

/**
 * 出库单 Service
 */
public interface InventoryOutService extends IService<InventoryOut> {
    
    /**
     * 分页查询出库单
     */
    PageResult<InventoryOut> pageOut(Long page, Long pageSize, Long warehouseId, Integer outType, Integer status);
    
    /**
     * 根据ID查询出库单
     */
    InventoryOut getOutById(Long id);
    
    /**
     * 查询出库明细
     */
    List<InventoryOutDetail> getOutDetails(Long outId);
    
    /**
     * 保存出库单
     */
    boolean saveOut(InventoryOut out);
    
    /**
     * 保存出库单及明细
     */
    boolean saveOutWithDetails(InventoryOut out, List<InventoryOutDetail> details);
    
    /**
     * 审核出库单 (扣减库存)
     */
    boolean auditOut(Long id, Long auditorId);
    
    /**
     * 取消出库单
     */
    boolean cancelOut(Long id);

    /**
     * 根据条码查询商品信息（扫码出库）
     */
    InventoryOutDetail getByBarcode(String barcode);
}