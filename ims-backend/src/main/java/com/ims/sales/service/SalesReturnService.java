package com.ims.sales.service;

import com.ims.sales.entity.SalesReturn;
import com.ims.sales.entity.SalesReturnDetail;

import java.util.List;

/**
 * 销售退货服务接口
 */
public interface SalesReturnService {

    /**
     * 创建退货单
     */
    SalesReturn create(SalesReturn salesReturn, List<SalesReturnDetail> details);

    /**
     * 更新退货单
     */
    SalesReturn update(Long id, SalesReturn salesReturn, List<SalesReturnDetail> details);

    /**
     * 审核退货单
     */
    void approve(Long id, String userId);

    /**
     * 拒绝退货单
     */
    void reject(Long id, String reason);

    /**
     * 取消退货单
     */
    void cancel(Long id, String reason);

    /**
     * 退货入库
     */
    void inbound(Long id, String userId);

    /**
     * 根据ID查询
     */
    SalesReturn getById(Long id);

    /**
     * 根据退货单号查询
     */
    SalesReturn getByReturnNo(String returnNo);

    /**
     * 查询退货明细
     */
    List<SalesReturnDetail> getDetails(Long returnId);

    /**
     * 查询列表
     */
    List<SalesReturn> list(SalesReturn query);

    /**
     * 删除
     */
    void delete(Long id);
}