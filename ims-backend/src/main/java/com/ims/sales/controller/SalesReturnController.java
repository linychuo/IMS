package com.ims.sales.controller;

import com.ims.sales.entity.SalesReturn;
import com.ims.sales.entity.SalesReturnDetail;
import com.ims.sales.service.SalesReturnService;
import com.ims.system.annotation.Permission;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales/return")
@Permission(code = "sales:return", name = "销售退货")
public class SalesReturnController {

    private static final Logger log = LoggerFactory.getLogger(SalesReturnController.class);
    private final SalesReturnService salesReturnService;

    public SalesReturnController(SalesReturnService salesReturnService) {
        this.salesReturnService = salesReturnService;
    }

    @PostMapping
    @Permission(code = "create", name = "创建销售退货")
    public ResponseEntity<SalesReturn> create(@Valid @RequestBody SalesReturn salesReturn,
                                             @RequestBody List<SalesReturnDetail> details) {
        return ResponseEntity.ok(salesReturnService.create(salesReturn, details));
    }

    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新销售退货")
    public ResponseEntity<SalesReturn> update(@PathVariable Long id,
                                               @Valid @RequestBody SalesReturn salesReturn,
                                               @RequestBody List<SalesReturnDetail> details) {
        return ResponseEntity.ok(salesReturnService.update(id, salesReturn, details));
    }

    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核销售退货")
    public ResponseEntity<Void> approve(@PathVariable Long id, @RequestParam String userId) {
        salesReturnService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reject")
    @Permission(code = "reject", name = "拒绝销售退货")
    public ResponseEntity<Void> reject(@PathVariable Long id, @RequestParam String reason) {
        salesReturnService.reject(id, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消销售退货")
    public ResponseEntity<Void> cancel(@PathVariable Long id, @RequestParam String reason) {
        salesReturnService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/inbound")
    @Permission(code = "inbound", name = "销售退货入库")
    public ResponseEntity<Void> inbound(@PathVariable Long id, @RequestParam String userId) {
        salesReturnService.inbound(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看销售退货")
    public ResponseEntity<SalesReturn> getById(@PathVariable Long id) {
        return ResponseEntity.ok(salesReturnService.getById(id));
    }

    @GetMapping("/no/{returnNo}")
    @Permission(code = "read", name = "查看销售退货")
    public ResponseEntity<SalesReturn> getByReturnNo(@PathVariable String returnNo) {
        return ResponseEntity.ok(salesReturnService.getByReturnNo(returnNo));
    }

    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看销售退货")
    public ResponseEntity<List<SalesReturnDetail>> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(salesReturnService.getDetails(id));
    }

    @GetMapping("/list")
    @Permission(code = "read", name = "查看销售退货")
    public ResponseEntity<List<SalesReturn>> list(@ModelAttribute SalesReturn query) {
        return ResponseEntity.ok(salesReturnService.list(query));
    }
}