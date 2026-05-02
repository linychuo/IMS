package com.ims.sales.service;

import com.ims.sales.entity.SalesOut;
import com.ims.sales.entity.SalesOutDetail;

import java.util.List;

/**
 * 销售出库服务接口
 */
public interface SalesOutService {

    /**
     * 创建销售出库单
     */
    SalesOut create(SalesOut salesOut, List<SalesOutDetail> details);

    /**
     * 审核出库单
     */
    void approve(String id, String userId);

    /**
     * 取消出库单
     */
    void cancel(String id, String reason);

    /**
     * 完成出库
     */
    void complete(String id);

    /**
     * 根据ID查询
     */
    SalesOut getById(String id);

    /**
     * 根据单号查询
     */
    SalesOut getByOutNo(String outNo);

    /**
     * 查询明细
     */
    List<SalesOutDetail> getDetails(String outId);

    /**
     * 查询列表
     */
    List<SalesOut> list(SalesOut query);

    /**
     * 删除
     */
    void delete(String id);
}