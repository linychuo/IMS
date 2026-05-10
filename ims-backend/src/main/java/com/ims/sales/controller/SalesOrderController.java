package com.ims.sales.controller;

import com.ims.sales.entity.SalesOrder;
import com.ims.sales.entity.SalesOrderDetail;
import com.ims.sales.service.SalesOrderService;
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
    public ResponseEntity<SalesOrder> create(@Valid @RequestBody SalesOrder salesOrder,
                                           @RequestBody List<SalesOrderDetail> details) {
        return ResponseEntity.ok(salesOrderService.create(salesOrder, details));
    }

    /**
     * 更新订单
     */
    @PutMapping("/{id}")
    public ResponseEntity<SalesOrder> update(@PathVariable Long id,
                                          @Valid @RequestBody SalesOrder salesOrder,
                                          @RequestBody List<SalesOrderDetail> details) {
        return ResponseEntity.ok(salesOrderService.update(id, salesOrder, details));
    }

    /**
     * 审核订单
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approve(@PathVariable Long id,
                                         @RequestParam String userId) {
        salesOrderService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 取消订单
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id,
                                       @RequestParam String reason) {
        salesOrderService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public ResponseEntity<SalesOrder> getById(@PathVariable Long id) {
        return ResponseEntity.ok(salesOrderService.getById(id));
    }

    /**
     * 根据订单号查询
     */
    @GetMapping("/no/{orderNo}")
    public ResponseEntity<SalesOrder> getByOrderNo(@PathVariable String orderNo) {
        return ResponseEntity.ok(salesOrderService.getByOrderNo(orderNo));
    }

    /**
     * 查询订单明细
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<List<SalesOrderDetail>> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(salesOrderService.getDetails(id));
    }

    /**
     * 查询列表
     */
    @GetMapping("/list")
    public ResponseEntity<List<SalesOrder>> list(@ModelAttribute SalesOrder query) {
        return ResponseEntity.ok(salesOrderService.list(query));
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        salesOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}