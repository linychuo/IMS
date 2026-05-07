package com.ims.sales.service.impl;

import com.ims.common.util.OrderNoGenerator;
import com.ims.sales.entity.SalesPriceStrategy;
import com.ims.sales.mapper.SalesPriceStrategyMapper;
import com.ims.sales.service.SalesPriceStrategyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 销售价格策略服务实现
 */
@Service
public class SalesPriceStrategyServiceImpl implements SalesPriceStrategyService {

    private static final Logger log = LoggerFactory.getLogger(SalesPriceStrategyServiceImpl.class);

    private final SalesPriceStrategyMapper salesPriceStrategyMapper;
    private final OrderNoGenerator orderNoGenerator;

    public SalesPriceStrategyServiceImpl(SalesPriceStrategyMapper salesPriceStrategyMapper,
                                          OrderNoGenerator orderNoGenerator) {
        this.salesPriceStrategyMapper = salesPriceStrategyMapper;
        this.orderNoGenerator = orderNoGenerator;
    }

    @Override
    @Transactional
    public SalesPriceStrategy create(SalesPriceStrategy strategy) {
        strategy.setStrategyNo(orderNoGenerator.generateSalesPriceStrategyNo());
        strategy.setStatus(1);
        salesPriceStrategyMapper.insert(strategy);
        log.info("创建销售价格策略: {}", strategy.getStrategyNo());
        return strategy;
    }

    @Override
    @Transactional
    public SalesPriceStrategy update(String id, SalesPriceStrategy strategy) {
        SalesPriceStrategy existing = salesPriceStrategyMapper.selectById(id);
        if (existing == null) {
            throw new RuntimeException("策略不存在: " + id);
        }
        strategy.setId(id);
        strategy.setUpdatedAt(LocalDateTime.now());
        salesPriceStrategyMapper.update(strategy);
        log.info("更新销售价格策略: {}", id);
        return strategy;
    }

    @Override
    @Transactional
    public void updateStatus(String id, Integer status) {
        SalesPriceStrategy strategy = new SalesPriceStrategy();
        strategy.setId(id);
        strategy.setStatus(status);
        strategy.setUpdatedAt(LocalDateTime.now());
        salesPriceStrategyMapper.update(strategy);
        log.info("更新销售价格策略状态: {} -> {}", id, status);
    }

    @Override
    public SalesPriceStrategy getById(String id) {
        return salesPriceStrategyMapper.selectById(id);
    }

    @Override
    public SalesPriceStrategy getByStrategyNo(String strategyNo) {
        return salesPriceStrategyMapper.selectByStrategyNo(strategyNo);
    }

    @Override
    public List<SalesPriceStrategy> list(SalesPriceStrategy query) {
        return salesPriceStrategyMapper.selectList(query);
    }

    @Override
    public BigDecimal getPrice(String customerId, String productId, BigDecimal standardPrice) {
        if (standardPrice == null) {
            return standardPrice;
        }
        
        // 优先级: 客户+商品 > 客户 > 全局 > 商品
        SalesPriceStrategy strategy = salesPriceStrategyMapper.selectEffective(customerId, productId);
        
        if (strategy == null) {
            return standardPrice;
        }
        
        LocalDate today = LocalDate.now();
        
        // 检查日期范围
        if (strategy.getStartDate() != null && today.isBefore(strategy.getStartDate())) {
            return standardPrice;
        }
        if (strategy.getEndDate() != null && today.isAfter(strategy.getEndDate())) {
            return standardPrice;
        }
        
        // 计算价格
        if (strategy.getPriceType() == 1) {
            // 固定价
            return strategy.getPrice();
        } else if (strategy.getPriceType() == 2) {
            // 折扣率
            BigDecimal rate = strategy.getDiscountRate();
            if (rate != null && rate.compareTo(BigDecimal.ZERO) > 0) {
                return standardPrice.multiply(rate).divide(BigDecimal.valueOf(100));
            }
        }
        
        return standardPrice;
    }

    @Override
    @Transactional
    public void delete(String id) {
        SalesPriceStrategy strategy = salesPriceStrategyMapper.selectById(id);
        if (strategy == null) {
            throw new RuntimeException("策略不存在: " + id);
        }
        if (strategy.getStatus() == 1) {
            throw new RuntimeException("启用状态不可删除");
        }
        salesPriceStrategyMapper.deleteById(id);
        log.info("删除销售价格策略: {}", id);
    }
}