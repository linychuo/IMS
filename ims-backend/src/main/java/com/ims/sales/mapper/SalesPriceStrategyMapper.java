package com.ims.sales.mapper;

import com.ims.sales.entity.SalesPriceStrategy;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 销售价格策略 Mapper
 */
@Mapper
public interface SalesPriceStrategyMapper {

    /**
     * 根据ID查询
     */
    SalesPriceStrategy selectById(@Param("id") Long id);

    /**
     * 根据策略编号查询
     */
    SalesPriceStrategy selectByStrategyNo(@Param("strategyNo") String strategyNo);

    /**
     * 查询列表
     */
    List<SalesPriceStrategy> selectList(SalesPriceStrategy query);

    /**
     * 查询有效的价格策略(客户+商品)
     */
    SalesPriceStrategy selectEffective(@Param("customerId") Long customerId,
                                      @Param("productId") Long productId);

    /**
     * 新增
     */
    int insert(SalesPriceStrategy entity);

    /**
     * 更新
     */
    int update(SalesPriceStrategy entity);

    /**
     * 删除
     */
    int deleteById(@Param("id") Long id);
}