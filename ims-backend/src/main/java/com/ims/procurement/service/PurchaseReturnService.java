package com.ims.procurement.service;

import com.ims.procurement.entity.PurchaseReturn;
import com.ims.procurement.entity.PurchaseReturnDetail;

import java.util.List;

/**
 * 采购退货服务接口
 */
public interface PurchaseReturnService {

    PurchaseReturn create(PurchaseReturn purchaseReturn, List<PurchaseReturnDetail> details);

    PurchaseReturn update(Long id, PurchaseReturn purchaseReturn, List<PurchaseReturnDetail> details);

    void approve(Long id, String userId);

    void reject(Long id, String reason);

    void cancel(Long id, String reason);

    void outbound(Long id, String userId);

    PurchaseReturn getById(Long id);

    PurchaseReturn getByReturnNo(String returnNo);

    List<PurchaseReturnDetail> getDetails(Long returnId);

    List<PurchaseReturn> list(PurchaseReturn query);

    void delete(Long id);
}