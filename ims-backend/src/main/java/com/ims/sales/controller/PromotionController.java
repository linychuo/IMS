package com.ims.sales.controller;

import com.ims.core.result.Result;
import com.ims.sales.entity.Promotion;
import com.ims.sales.service.PromotionService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 促销活动 Controller
 */
@RestController
@RequestMapping("/api/sales/promotion")
@Permission(code = "sales:promotion", name = "促销活动")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @GetMapping
    @Permission(code = "read", name = "查看促销活动")
    public Result<List<Promotion>> list() {
        return Result.success(promotionService.listAll());
    }

    @GetMapping("/active")
    @Permission(code = "read", name = "查看促销活动")
    public Result<List<Promotion>> getActivePromotions() {
        return Result.success(promotionService.getActivePromotions());
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看促销活动")
    public Result<Promotion> getById(@PathVariable Long id) {
        return Result.success(promotionService.getById(id));
    }

    @PostMapping
    @Permission(code = "create", name = "创建促销活动")
    public Result<Boolean> create(@RequestBody Promotion promotion) {
        return Result.success(promotionService.create(promotion));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新促销活动")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody Promotion promotion) {
        promotion.setId(id);
        return Result.success(promotionService.update(promotion));
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除促销活动")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(promotionService.delete(id));
    }

    @GetMapping("/price")
    @Permission(code = "read", name = "查看促销活动")
    public Result<BigDecimal> calculatePrice(
            @RequestParam Long productId,
            @RequestParam BigDecimal originalPrice) {
        return Result.success(promotionService.calculatePromotedPrice(productId, originalPrice));
    }

    @GetMapping("/product/{productId}")
    @Permission(code = "read", name = "查看促销活动")
    public Result<Promotion> getByProduct(
            @PathVariable Long productId,
            @RequestParam(required = false) LocalDate date) {
        return Result.success(promotionService.getPromotionByProduct(productId, date));
    }
}