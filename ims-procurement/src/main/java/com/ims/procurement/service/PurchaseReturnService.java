package com.ims.procurement.service;

import com.ims.procurement.entity.PurchaseReturn;
import com.ims.procurement.entity.PurchaseReturnDetail;

import java.util.List;

/**
 * 采购退货服务接口
 */
public interface PurchaseReturnService {

    /**
     * 创建采购退货单
     */
    PurchaseReturn create(PurchaseReturn purchaseReturn, List<PurchaseReturnDetail> details);

    /**
     * 更新采购退货单
     */
    PurchaseReturn update(String id, PurchaseReturn purchaseReturn, List<PurchaseReturnDetail> details);

    /**
     * 审核通过
     */
    void approve(String id, String userId);

    /**
     * 审核拒绝
     */
    void reject(String id, String reason);

    /**
     * 取消
     */
    void cancel(String id, String reason);

    /**
     * 出库（退货给供应商）
     */
    void outbound(String id, String userId);

    /**
     * 根据ID查询
     */
    PurchaseReturn getById(String id);

    /**
     * 根据单号查询
     */
    PurchaseReturn getByReturnNo(String returnNo);

    /**
     * 查询明细
     */
    List<PurchaseReturnDetail> getDetails(String returnId);

    /**
     * 查询列表
     */
    List<PurchaseReturn> list(PurchaseReturn query);

    /**
     * 删除
     */
    void delete(String id);
}