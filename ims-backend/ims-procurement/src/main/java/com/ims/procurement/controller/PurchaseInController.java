package com.ims.procurement.controller;

import com.ims.procurement.entity.PurchaseIn;
import com.ims.procurement.service.PurchaseInService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 采购入库控制器
 */
@RestController
@RequestMapping("/api/procurement/purchase-in")
public class PurchaseInController {

    private static final Logger log = LoggerFactory.getLogger(PurchaseInController.class);

    private final PurchaseInService purchaseInService;

    public PurchaseInController(PurchaseInService purchaseInService) {
        this.purchaseInService = purchaseInService;
    }

    /**
     * 创建入库单
     */
    @PostMapping
    public ResponseEntity<PurchaseIn> create(@Valid @RequestBody PurchaseIn purchaseIn) {
        return ResponseEntity.ok(purchaseInService.create(purchaseIn));
    }

    /**
     * 更新入库单
     */
    @PutMapping("/{id}")
    public ResponseEntity<PurchaseIn> update(@PathVariable String id,
                                              @Valid @RequestBody PurchaseIn purchaseIn) {
        return ResponseEntity.ok(purchaseInService.update(id, purchaseIn));
    }

    /**
     * 审核入库单
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approve(@PathVariable String id,
                                         @RequestParam String userId) {
        purchaseInService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 取消入库单
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable String id,
                                       @RequestParam String reason) {
        purchaseInService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * 完成入库
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> complete(@PathVariable String id) {
        purchaseInService.complete(id);
        return ResponseEntity.ok().build();
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseIn> getById(@PathVariable String id) {
        return ResponseEntity.ok(purchaseInService.getById(id));
    }

    /**
     * 根据单号查询
     */
    @GetMapping("/no/{inNo}")
    public ResponseEntity<PurchaseIn> getByInNo(@PathVariable String inNo) {
        return ResponseEntity.ok(purchaseInService.getByInNo(inNo));
    }

    /**
     * 查询列表
     */
    @GetMapping("/list")
    public ResponseEntity<List<PurchaseIn>> list(@ModelAttribute PurchaseIn query) {
        return ResponseEntity.ok(purchaseInService.list(query));
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        purchaseInService.delete(id);
        return ResponseEntity.noContent().build();
    }
}