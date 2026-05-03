package com.ims.inventory.service;

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
}