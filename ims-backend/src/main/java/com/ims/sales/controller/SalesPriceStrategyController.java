package com.ims.sales.controller;

import com.ims.sales.entity.SalesPriceStrategy;
import com.ims.sales.service.SalesPriceStrategyService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 销售价格策略控制器
 */
@RestController
@RequestMapping("/api/sales/price-strategy")
public class SalesPriceStrategyController {

    private static final Logger log = LoggerFactory.getLogger(SalesPriceStrategyController.class);

    private final SalesPriceStrategyService salesPriceStrategyService;

    public SalesPriceStrategyController(SalesPriceStrategyService salesPriceStrategyService) {
        this.salesPriceStrategyService = salesPriceStrategyService;
    }

    /**
     * 创建策略
     */
    @PostMapping
    public ResponseEntity<SalesPriceStrategy> create(@Valid @RequestBody SalesPriceStrategy strategy) {
        return ResponseEntity.ok(salesPriceStrategyService.create(strategy));
    }

    /**
     * 更新策略
     */
    @PutMapping("/{id}")
    public ResponseEntity<SalesPriceStrategy> update(@PathVariable Long id,
                                                    @Valid @RequestBody SalesPriceStrategy strategy) {
        return ResponseEntity.ok(salesPriceStrategyService.update(id, strategy));
    }

    /**
     * 启用/禁用
     */
    @PostMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable Long id,
                                           @RequestParam Integer status) {
        salesPriceStrategyService.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public ResponseEntity<SalesPriceStrategy> getById(@PathVariable Long id) {
        return ResponseEntity.ok(salesPriceStrategyService.getById(id));
    }

    /**
     * 根据策略编号查询
     */
    @GetMapping("/no/{strategyNo}")
    public ResponseEntity<SalesPriceStrategy> getByStrategyNo(@PathVariable String strategyNo) {
        return ResponseEntity.ok(salesPriceStrategyService.getByStrategyNo(strategyNo));
    }

    /**
     * 查询列表
     */
    @GetMapping("/list")
    public ResponseEntity<List<SalesPriceStrategy>> list(@ModelAttribute SalesPriceStrategy query) {
        return ResponseEntity.ok(salesPriceStrategyService.list(query));
    }

    /**
     * 获取价格(客户+商品)
     */
    @GetMapping("/price")
    public ResponseEntity<BigDecimal> getPrice(@RequestParam Long customerId,
                                               @RequestParam Long productId,
                                               @RequestParam BigDecimal standardPrice) {
        return ResponseEntity.ok(salesPriceStrategyService.getPrice(customerId, productId, standardPrice));
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        salesPriceStrategyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}