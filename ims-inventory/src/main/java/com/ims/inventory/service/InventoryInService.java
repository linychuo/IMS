package com.ims.inventory.service;

<<<<<<< HEAD
import com.ims.inventory.entity.InventoryIn;
import com.ims.inventory.entity.InventoryInDetail;
import java.util.List;

/**
 * 入库单服务接口
 */
public interface InventoryInService {

    /**
     * 创建入库单
     */
    InventoryIn create(InventoryIn inventoryIn, List<InventoryInDetail> details);

    /**
     * 审核入库单
     */
    void approve(String id, String userId);

    /**
     * 取消入库单
     */
    void cancel(String id, String reason);

    /**
     * 完成入库 (审核并入库)
     */
    void complete(String id, String userId);

    /**
     * 根据ID查询
     */
    InventoryIn getById(String id);

    /**
     * 根据入库单号查询
     */
    InventoryIn getByInNo(String inNo);

    /**
     * 查询明细
     */
    List<InventoryInDetail> getDetails(String inId);

    /**
     * 查询列表
     */
    List<InventoryIn> list(InventoryIn query);

    /**
     * 删除
     */
    void delete(String id);
=======
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.core.dto.PageResult;
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
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}