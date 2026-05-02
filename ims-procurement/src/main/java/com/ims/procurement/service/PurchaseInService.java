package com.ims.procurement.service;

import com.ims.procurement.entity.PurchaseIn;

import java.util.List;

/**
 * 采购入库服务接口
 */
public interface PurchaseInService {

    /**
     * 创建采购入库单
     */
    PurchaseIn create(PurchaseIn purchaseIn);

    /**
     * 更新采购入库单
     */
    PurchaseIn update(String id, PurchaseIn purchaseIn);

    /**
     * 审核入库单
     */
    void approve(String id, String userId);

    /**
     * 取消入库单
     */
    void cancel(String id, String reason);

    /**
     * 完成入库（确认入库数量）
     */
    void complete(String id);

    /**
     * 根据ID查询
     */
    PurchaseIn getById(String id);

    /**
     * 根据单号查询
     */
    PurchaseIn getByInNo(String inNo);

    /**
     * 查询列表
     */
    List<PurchaseIn> list(PurchaseIn query);

    /**
     * 删除
     */
    void delete(String id);
}