package com.ims.procurement.controller;

import com.ims.core.result.Result;
import com.ims.procurement.entity.SupplierPriceAgreement;
import com.ims.procurement.service.SupplierPriceAgreementService;
import com.ims.system.annotation.Permission;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * 供应商价格协议控制器
 */
@RestController
@RequestMapping("/api/procurement/price-agreement")
@Permission(code = "procurement:price-agreement", name = "价格协议")
public class SupplierPriceAgreementController {

    private static final Logger log = LoggerFactory.getLogger(SupplierPriceAgreementController.class);
    private final SupplierPriceAgreementService service;

    public SupplierPriceAgreementController(SupplierPriceAgreementService service) {
        this.service = service;
    }

    @PostMapping
    @Permission(code = "create", name = "创建价格协议")
    public Result<SupplierPriceAgreement> create(@RequestBody SupplierPriceAgreement agreement) {
        return Result.success(service.create(agreement));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新价格协议")
    public Result<SupplierPriceAgreement> update(@PathVariable Long id, @RequestBody SupplierPriceAgreement agreement) {
        return Result.success(service.update(id, agreement));
    }

    @PostMapping("/{id}/status")
    @Permission(code = "update", name = "更新价格协议")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        service.updateStatus(id, status);
        return Result.success(null);
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看价格协议")
    public Result<SupplierPriceAgreement> getById(@PathVariable Long id) {
        return Result.success(service.getById(id));
    }

    @GetMapping("/list")
    @Permission(code = "read", name = "查看价格协议")
    public Result<List<SupplierPriceAgreement>> list(@ModelAttribute SupplierPriceAgreement query) {
        return Result.success(service.list(query));
    }

    @GetMapping("/price")
    @Permission(code = "read", name = "查看价格协议")
    public Result<BigDecimal> getPrice(@RequestParam Long supplierId,
                                               @RequestParam Long productId,
                                               @RequestParam(required = false) BigDecimal quantity,
                                               @RequestParam BigDecimal standardPrice) {
        return Result.success(service.getPrice(supplierId, productId, quantity, standardPrice));
    }

    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除价格协议")
    public Result<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return Result.success(null);
    }
}