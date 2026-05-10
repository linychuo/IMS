package com.ims.sales.controller;

import com.ims.sales.entity.SalesOut;
import com.ims.sales.entity.SalesOutDetail;
import com.ims.sales.service.SalesOutService;
import com.ims.system.annotation.Permission;
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
@Permission(code = "sales:out", name = "销售出库")
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
    @Permission(code = "create", name = "创建销售出库")
    public ResponseEntity<SalesOut> create(@Valid @RequestBody SalesOut salesOut,
                                            @RequestBody	List<SalesOutDetail> details) {
        return ResponseEntity.ok(salesOutService.create(salesOut, details));
    }

    /**
     * 审核出库单
     */
    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核销售出库")
    public ResponseEntity<Void> approve(@PathVariable Long id,
                                         @RequestParam String userId) {
        salesOutService.approve(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * 取消出库单
     */
    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消销售出库")
    public ResponseEntity<Void> cancel(@PathVariable Long id,
                                       @RequestParam String reason) {
        salesOutService.cancel(id, reason);
        return ResponseEntity.ok().build();
    }

    /**
     * 完成出库
     */
    @PostMapping("/{id}/complete")
    @Permission(code = "complete", name = "完成销售出库")
    public ResponseEntity<Void> complete(@PathVariable Long id) {
        salesOutService.complete(id);
        return ResponseEntity.ok().build();
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看销售出库")
    public ResponseEntity<SalesOut> getById(@PathVariable Long id) {
        return ResponseEntity.ok(salesOutService.getById(id));
    }

    /**
     * 根据单号查询
     */
    @GetMapping("/no/{outNo}")
    @Permission(code = "read", name = "查看销售出库")
    public ResponseEntity<SalesOut> getByOutNo(@PathVariable String outNo) {
        return ResponseEntity.ok(salesOutService.getByOutNo(outNo));
    }

    /**
     * 查询明细
     */
    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看销售出库")
    public ResponseEntity<List<SalesOutDetail>> getDetails(@PathVariable Long id) {
        return ResponseEntity.ok(salesOutService.getDetails(id));
    }

    /**
     * 查询列表
     */
    @GetMapping("/list")
    @Permission(code = "read", name = "查看销售出库")
    public ResponseEntity<List<SalesOut>> list(@ModelAttribute SalesOut query) {
        return ResponseEntity.ok(salesOutService.list(query));
    }
}