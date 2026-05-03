package com.ims.inventory.service;

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
}