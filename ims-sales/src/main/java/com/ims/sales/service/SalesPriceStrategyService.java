package com.ims.sales.service;

import com.ims.sales.entity.SalesPriceStrategy;

import java.math.BigDecimal;
import java.util.List;

/**
 * 销售价格策略服务接口
 */
public interface SalesPriceStrategyService {

    /**
     * 创建策略
     */
    SalesPriceStrategy create(SalesPriceStrategy strategy);

    /**
     * 更新策略
     */
    SalesPriceStrategy update(String id, SalesPriceStrategy strategy);

    /**
     * 启用/禁用
     */
    void updateStatus(String id, Integer status);

    /**
     * 根据ID查询
     */
    SalesPriceStrategy getById(String id);

    /**
     * 根据策略编号查询
     */
    SalesPriceStrategy getByStrategyNo(String strategyNo);

    /**
     * 查询列表
     */
    List<SalesPriceStrategy> list(SalesPriceStrategy query);

    /**
     * 获取有效价格(客户+商品)
     */
    BigDecimal getPrice(String customerId, String productId, BigDecimal standardPrice);

    /**
     * 删除
     */
    void delete(String id);
}