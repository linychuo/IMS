package com.ims.procurement.service;

import com.ims.procurement.entity.PurchaseIn;

import java.util.List;

/**
 * 采购入库服务接口
 */
public interface PurchaseInService {

    PurchaseIn create(PurchaseIn purchaseIn);

    PurchaseIn update(Long id, PurchaseIn purchaseIn);

    void approve(Long id, String userId);

    void cancel(Long id, String reason);

    void complete(Long id);

    PurchaseIn getById(Long id);

    PurchaseIn getByInNo(String inNo);

    List<PurchaseIn> list(PurchaseIn query);

    void delete(Long id);
}