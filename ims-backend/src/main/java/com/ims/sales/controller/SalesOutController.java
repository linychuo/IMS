package com.ims.sales.controller;

import com.ims.sales.entity.SalesOut;
import com.ims.sales.entity.SalesOutDetail;
import com.ims.sales.service.SalesOutService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 销售出库控制器
 */
@RestController
@RequestMapping("/api/sales/out")
public class SalesOutController {

    private static final Logger log = LoggerFactory.getLogger(SalesOutController.class);

    private final SalesOutService salesOutService;

    public SalesOutController(SalesOutService salesOutService) {
        this.salesOutService = salesOutService;
    }

    /**
     * 创建出库单
     */
    @PostMapping
    public ResponseEntity<SalesOut> create(@Valid @RequestBody SalesOut salesOut,
                                            @RequestBody	List<SalesOutDetail> details) {
        return ResponseEntity.ok(salesOutService.create(salesOut, details));
    }

    /**
     * 审核出库单
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<Void> approve(@PathVariable Long id,
                                         @RequestParam String userId) {
        salesOutService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 取消出库单
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(@PathVariable Long id,
                                       @RequestParam String reason) {
        salesOutService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * 完成出库
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<Void> complete(@PathVariable Long id) {
        salesOutService.complete(id);
        return ResponseEntity.ok().build();
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    public ResponseEntity<SalesOut> getById(@PathVariable Long id) {
        return ResponseEntity.ok(salesOutService.getById(id));
    }

    /**
     * 根据单号查询
     */
    @GetMapping("/no/{outNo}")
    public ResponseEntity<SalesOut> getByOutNo(@PathVariable String outNo) {
        return ResponseEntity.ok(salesOutService.getByOutNo(outNo));
    }

    /**
     * 查询明细
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<List<SalesOutDetail>> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(salesOutService.getDetails(id));
    }

    /**
     * 查询列表
     */
    @GetMapping("/list")
    public ResponseEntity<List<SalesOut>> list(@ModelAttribute SalesOut query) {
        return ResponseEntity.ok(salesOutService.list(query));
    }

    /**
     * 删除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        salesOutService.delete(id);
        return ResponseEntity.noContent().build();
    }
}