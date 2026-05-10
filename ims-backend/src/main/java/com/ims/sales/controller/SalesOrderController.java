package com.ims.sales.controller;

import com.ims.sales.entity.SalesOrder;
import com.ims.sales.entity.SalesOrderDetail;
import com.ims.sales.service.SalesOrderService;
import com.ims.system.annotation.Permission;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 销售订单控制器
 */
@RestController
@RequestMapping("/api/sales/order")
@Permission(code = "sales:order", name = "销售订单")
public class SalesOrderController {

    private static final Logger log = LoggerFactory.getLogger(SalesOrderController.class);

    private final SalesOrderService salesOrderService;

    public SalesOrderController(SalesOrderService salesOrderService) {
        this.salesOrderService = salesOrderService;
    }

    /**
     * 创建订单
     */
    @PostMapping
    @Permission(code = "create", name = "创建销售订单")
    public ResponseEntity<SalesOrder> create(@Valid @RequestBody SalesOrder salesOrder,
                                           @RequestBody List<SalesOrderDetail> details) {
        return ResponseEntity.ok(salesOrderService.create(salesOrder, details));
    }

    /**
     * 更新订单
     */
    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新销售订单")
    public ResponseEntity<SalesOrder> update(@PathVariable Long id,
                                          @Valid @RequestBody SalesOrder salesOrder,
                                          @RequestBody List<SalesOrderDetail> details) {
        return ResponseEntity.ok(salesOrderService.update(id, salesOrder, details));
    }

    /**
     * 审核订单
     */
    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核销售订单")
    public ResponseEntity<Void> approve(@PathVariable Long id,
                                         @RequestParam String userId) {
        salesOrderService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 取消订单
     */
    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消销售订单")
    public ResponseEntity<Void> cancel(@PathVariable Long id,
                                       @RequestParam String reason) {
        salesOrderService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看销售订单")
    public ResponseEntity<SalesOrder> getById(@PathVariable Long id) {
        return ResponseEntity.ok(salesOrderService.getById(id));
    }

    /**
     * 根据订单号查询
     */
    @GetMapping("/no/{orderNo}")
    @Permission(code = "read", name = "查看销售订单")
    public ResponseEntity<SalesOrder> getByOrderNo(@PathVariable String orderNo) {
        return ResponseEntity.ok(salesOrderService.getByOrderNo(orderNo));
    }

    /**
     * 查询订单明细
     */
    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看销售订单")
    public ResponseEntity<List<SalesOrderDetail>> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(salesOrderService.getDetails(id));
    }

    /**
     * 查询列表
     */
    @GetMapping("/list")
    @Permission(code = "read", name = "查看销售订单")
    public ResponseEntity<List<SalesOrder>> list(@ModelAttribute SalesOrder query) {
        return ResponseEntity.ok(salesOrderService.list(query));
    }
}