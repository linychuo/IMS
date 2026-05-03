package com.ims.sales.controller;

import com.ims.sales.entity.SalesPriceStrategy;
import com.ims.sales.service.SalesPriceStrategyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 销售价格策略控制器
 */
@RestController
@RequestMapping("/api/sales/price-strategy")
@RequiredArgsConstructor
public class SalesPriceStrategyController {

    private final SalesPriceStrategyService salesPriceStrategyService;

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
    public ResponseEntity<SalesPriceStrategy> update(@PathVariable String id,
                                                    @Valid @RequestBody SalesPriceStrategy strategy) {
        return ResponseEntity.ok(salesPriceStrategyService.update(id, strategy));
    }

    /**
     * 启用/禁用
     */
    @PostMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(@PathVariable String id, 
                                           @RequestParam Integer status) {
        salesPriceStrategyService.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public ResponseEntity<SalesPriceStrategy> getById(@PathVariable String id) {
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
    public ResponseEntity<BigDecimal> getPrice(@RequestParam String customerId,
                                               @RequestParam String productId,
                                               @RequestParam BigDecimal standardPrice) {
        return ResponseEntity.ok(salesPriceStrategyService.getPrice(customerId, productId, standardPrice));
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        salesPriceStrategyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}