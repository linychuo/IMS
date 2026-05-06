package com.ims.inventory.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.core.result.PageResult;
import com.ims.inventory.entity.InventoryCheck;
import com.ims.inventory.entity.InventoryCheckDetail;
import java.util.List;

/**
 * 库存盘点 Service 接口
 */
public interface InventoryCheckService extends IService<InventoryCheck> {

    /**
     * 分页查询
     */
    PageResult<InventoryCheck> page(Long page, Long pageSize, Long warehouseId, Integer status);

    /**
     * 根据ID查询
     */
    InventoryCheck getById(Long id);

    /**
     * 创建盘点单
     */
    InventoryCheck create(InventoryCheck check, List<InventoryCheckDetail> details);

    /**
     * 开始盘点
     */
    boolean startCheck(Long id, Long checkerId);

    /**
     * 提交盘点结果
     */
    boolean submitResult(Long id, List<InventoryCheckDetail> details);

    /**
     * 完成盘点(调整库存)
     */
    boolean finishCheck(Long id);

    /**
     * 取消盘点
     */
    boolean cancelCheck(Long id, String reason);

    /**
     * 获取盘点明细
     */
    List<InventoryCheckDetail> getDetails(Long checkId);

    /**
     * 查询进行中的盘点
     */
    List<InventoryCheck> listPending(Long warehouseId);
}