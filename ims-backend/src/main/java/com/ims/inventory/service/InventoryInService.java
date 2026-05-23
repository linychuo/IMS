package com.ims.inventory.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.core.result.PageResult;
import com.ims.inventory.entity.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 入库单 Service
 */
public interface InventoryInService extends IService<InventoryIn> {
    
    /**
     * 分页查询入库单
     */
    PageResult<InventoryIn> pageIn(Long page, Long pageSize, Long warehouseId, Integer inType, Integer status);
    
    /**
     * 根据ID查询入库单
     */
    InventoryIn getInById(Long id);
    
    /**
     * 查询入库明细
     */
    List<InventoryInDetail> getInDetails(Long inId);
    
    /**
     * 保存入库单
     */
    boolean saveIn(InventoryIn in);
    
    /**
     * 保存入库单及明细
     */
    boolean saveInWithDetails(InventoryIn in, List<InventoryInDetail> details);
    
    /**
     * 审核入库单 (增加库存)
     */
    boolean auditIn(Long id, Long auditorId);
    
    /**
     * 取消入库单
     */
    boolean cancelIn(Long id);

    /**
     * 根据条码查询商品信息（扫码入库）
     */
    InventoryInDetail getByBarcode(String barcode);
}