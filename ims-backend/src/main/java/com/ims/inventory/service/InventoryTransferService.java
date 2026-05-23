package com.ims.inventory.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.core.result.PageResult;
import com.ims.inventory.entity.InventoryTransfer;
import com.ims.inventory.entity.InventoryTransferDetail;
import java.util.List;

/**
 * 库存调拨 Service 接口
 */
public interface InventoryTransferService extends IService<InventoryTransfer> {

    /**
     * 分页查询
     */
    PageResult<InventoryTransfer> page(Long page, Long pageSize, Long fromWarehouseId, Long toWarehouseId, Integer status);

    /**
     * 根据ID查询
     */
    InventoryTransfer getById(Long id);

    /**
     * 创建调拨单
     */
    InventoryTransfer create(InventoryTransfer transfer, List<InventoryTransferDetail> details);

    /**
     * 审核调拨单
     */
    boolean approve(Long id, Long auditorId);

    /**
     * 开始调拨
     */
    boolean startTransfer(Long id, Long transfererId);

    /**
     * 确认出库
     */
    boolean confirmOut(Long id);

    /**
     * 确认入库
     */
    boolean confirmIn(Long id);

    /**
     * 完成调拨
     */
    boolean finishTransfer(Long id);

    /**
     * 取消调拨
     */
    boolean cancelTransfer(Long id, String reason);

    /**
     * 获取调拨明细
     */
    List<InventoryTransferDetail> getDetails(Long transferId);

    /**
     * 查询进行中的调拨
     */
    List<InventoryTransfer> listPending();
}