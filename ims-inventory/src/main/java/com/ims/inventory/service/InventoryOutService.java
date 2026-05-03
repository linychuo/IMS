package com.ims.inventory.service;

<<<<<<< HEAD
import com.ims.inventory.entity.InventoryOut;
import com.ims.inventory.entity.InventoryOutDetail;
import java.util.List;

/**
 * 出库单服务接口
 */
public interface InventoryOutService {

    /**
     * 创建出库单
     */
    InventoryOut create(InventoryOut inventoryOut, List<InventoryOutDetail> details);

    /**
     * 审核出库单
     */
    void approve(String id, String userId);

    /**
     * 取消出库单
     */
    void cancel(String id, String reason);

    /**
     * 完成出库 (审核并出库)
     */
    void complete(String id, String userId);

    /**
     * 根据ID查询
     */
    InventoryOut getById(String id);

    /**
     * 根据出库单号查询
     */
    InventoryOut getByOutNo(String outNo);

    /**
     * 查询明细
     */
    List<InventoryOutDetail> getDetails(String outId);

    /**
     * 查询列表
     */
    List<InventoryOut> list(InventoryOut query);

    /**
     * 删除
     */
    void delete(String id);
=======
import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.core.dto.PageResult;
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
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}