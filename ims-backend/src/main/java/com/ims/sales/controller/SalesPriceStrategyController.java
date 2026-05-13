package com.ims.sales.controller;

import com.ims.core.result.Result;
import com.ims.sales.entity.SalesPriceStrategy;
import com.ims.sales.service.SalesPriceStrategyService;
import com.ims.system.annotation.Permission;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 销售价格策略控制器
 */
@RestController
@RequestMapping("/api/sales/price-strategy")
@Permission(code = "sales:price-strategy", name = "价格策略")
public class SalesPriceStrategyController {

    private static final Logger log = LoggerFactory.getLogger(SalesPriceStrategyController.class);
    private final SalesPriceStrategyService salesPriceStrategyService;

    public SalesPriceStrategyController(SalesPriceStrategyService salesPriceStrategyService) {
        this.salesPriceStrategyService = salesPriceStrategyService;
    }

    @PostMapping
    @Permission(code = "create", name = "创建价格策略")
    public Result<SalesPriceStrategy> create(@Valid @RequestBody SalesPriceStrategy strategy) {
        return Result.success(salesPriceStrategyService.create(strategy));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新价格策略")
    public Result<SalesPriceStrategy> update(@PathVariable Long id, @Valid @RequestBody SalesPriceStrategy strategy) {
        return Result.success(salesPriceStrategyService.update(id, strategy));
    }

    @PostMapping("/{id}/status")
    @Permission(code = "update", name = "更新价格策略")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        salesPriceStrategyService.updateStatus(id, status);
        return Result.success(null);
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看价格策略")
    public Result<SalesPriceStrategy> getById(@PathVariable Long id) {
        return Result.success(salesPriceStrategyService.getById(id));
    }

    @GetMapping("/no/{strategyNo}")
    @Permission(code = "read", name = "查看价格策略")
    public Result<SalesPriceStrategy> getByStrategyNo(@PathVariable String strategyNo) {
        return Result.success(salesPriceStrategyService.getByStrategyNo(strategyNo));
    }

    @GetMapping("/list")
    @Permission(code = "read", name = "查看价格策略")
    public Result<List<SalesPriceStrategy>> list(@ModelAttribute SalesPriceStrategy query) {
        return Result.success(salesPriceStrategyService.list(query));
    }

    @GetMapping("/price")
    @Permission(code = "read", name = "查看价格策略")
    public Result<BigDecimal> getPrice(@RequestParam Long customerId,
                                               @RequestParam Long productId,
                                               @RequestParam BigDecimal standardPrice) {
        return Result.success(salesPriceStrategyService.getPrice(customerId, productId, standardPrice));
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除价格策略")
    public Result<Void> delete(@PathVariable Long id) {
        salesPriceStrategyService.delete(id);
        return Result.success(null);
    }
}