package com.ims.sales.controller;

import com.ims.sales.entity.SalesReturn;
import com.ims.sales.entity.SalesReturnDetail;
import com.ims.sales.service.SalesReturnService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 销售退货控制器
 */
@RestController
@RequestMapping("/api/sales/return")
public class SalesReturnController {

    private static final Logger log = LoggerFactory.getLogger(SalesReturnController.class);

    private final SalesReturnService salesReturnService;

    public SalesReturnController(SalesReturnService salesReturnService) {
        this.salesReturnService = salesReturnService;
    }

    /**
     * 创建退货单
     */
    @PostMapping
    public ResponseEntity<SalesReturn> create(@Valid @RequestBody SalesReturn salesReturn,
                                             @RequestBody List<SalesReturnDetail> details) {
        return ResponseEntity.ok(salesReturnService.create(salesReturn, details));
    }

    /**
     * 更新退货单
     */
    @PutMapping("/{id}")
    public ResponseEntity<SalesReturn> update(@PathVariable String id,
                                               @Valid @RequestBody SalesReturn salesReturn,
                                               @RequestBody List<SalesReturnDetail> details) {
        return ResponseEntity.ok(salesReturnService.update(id, salesReturn, details));
    }

    /**
     * 审核通过
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approve(@PathVariable String id,
                                        @RequestParam String userId) {
        salesReturnService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 拒绝
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<Void> reject(@PathVariable String id,
                                       @RequestParam String reason) {
        salesReturnService.reject(id, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * 取消
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable String id,
                                      @RequestParam String reason) {
        salesReturnService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * 退货入库
     */
    @PostMapping("/{id}/inbound")
    public ResponseEntity<Void> inbound(@PathVariable String id,
                                         @RequestParam String userId) {
        salesReturnService.inbound(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public ResponseEntity<SalesReturn> getById(@PathVariable String id) {
        return ResponseEntity.ok(salesReturnService.getById(id));
    }

    /**
     * 根据退货单号查询
     */
    @GetMapping("/no/{returnNo}")
    public ResponseEntity<SalesReturn> getByReturnNo(@PathVariable String returnNo) {
        return ResponseEntity.ok(salesReturnService.getByReturnNo(returnNo));
    }

    /**
     * 查询退货明细
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<List<SalesReturnDetail>> getDetails(@PathVariable String id) {
        return ResponseEntity.ok(salesReturnService.getDetails(id));
    }

    /**
     * 查询列表
     */
    @GetMapping("/list")
    public ResponseEntity<List<SalesReturn>> list(@ModelAttribute SalesReturn query) {
        return ResponseEntity.ok(salesReturnService.list(query));
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        salesReturnService.delete(id);
        return ResponseEntity.noContent().build();
    }
}