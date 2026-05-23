package com.ims.finance.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.finance.entity.Invoice;
import com.ims.finance.service.InvoiceService;
import com.ims.finance.service.impl.InvoiceServiceImpl.InvoiceStatistics;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 发票 Controller
 */
@RestController
@RequestMapping("/api/invoice")
@Permission(code = "finance:invoice", name = "发票管理")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    /**
     * 分页查询发票
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看发票")
    public Result<PageResult<Invoice>> page(
            @RequestParam Long page,
            @RequestParam Long pageSize,
            @RequestParam(required = false) Integer invoiceType,
            @RequestParam(required = false) Integer status) {

        // 使用 MyBatis Plus 的 LambdaQueryWrapper 进行分页查询
        var wrapper = new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Invoice>();
        if (invoiceType != null) {
            wrapper.eq(Invoice::getInvoiceType, invoiceType);
        }
        if (status != null) {
            wrapper.eq(Invoice::getStatus, status);
        }
        wrapper.eq(Invoice::getDeleted, 0);

        long total = invoiceService.count(wrapper);
        long offset = (page - 1) * pageSize;
        wrapper.last("LIMIT " + offset + ", " + pageSize);

        List<Invoice> records = invoiceService.list(wrapper);
        return Result.success(PageResult.build(records, total, page, pageSize));
    }

    /**
     * 获取发票详情
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看发票")
    public Result<Invoice> getById(@PathVariable Long id) {
        return Result.success(invoiceService.getById(id));
    }

    /**
     * 创建发票
     */
    @PostMapping
    @Permission(code = "add", name = "新增发票")
    public Result<Boolean> create(@RequestBody Invoice invoice) {
        return Result.success(invoiceService.createInvoice(invoice));
    }

    /**
     * 更新发票
     */
    @PutMapping("/{id}")
    @Permission(code = "edit", name = "编辑发票")
    public Result<Boolean> update(@PathVariable Long id, @RequestBody Invoice invoice) {
        invoice.setId(id);
        return Result.success(invoiceService.updateById(invoice));
    }

    /**
     * 删除发票
     */
    @DeleteMapping("/{id}")
    @Permission(code = "delete", name = "删除发票")
    public Result<Boolean> delete(@PathVariable Long id) {
        return Result.success(invoiceService.removeById(id));
    }

    /**
     * 根据单据查询发票
     */
    @GetMapping("/order")
    @Permission(code = "read", name = "查看发票")
    public Result<List<Invoice>> getByOrder(
            @RequestParam String orderType,
            @RequestParam Long orderId) {
        return Result.success(invoiceService.selectByOrder(orderType, orderId));
    }

    /**
     * 根据供应商查询采购发票
     */
    @GetMapping("/supplier/{supplierId}")
    @Permission(code = "read", name = "查看发票")
    public Result<List<Invoice>> getBySupplier(@PathVariable Long supplierId) {
        return Result.success(invoiceService.selectBySupplier(supplierId));
    }

    /**
     * 根据客户查询销售发票
     */
    @GetMapping("/customer/{customerId}")
    @Permission(code = "read", name = "查看发票")
    public Result<List<Invoice>> getByCustomer(@PathVariable Long customerId) {
        return Result.success(invoiceService.selectByCustomer(customerId));
    }

    /**
     * 发票勾选
     */
    @PostMapping("/{id}/check")
    @Permission(code = "check", name = "发票勾选")
    public Result<Boolean> checkInvoice(@PathVariable Long id) {
        return Result.success(invoiceService.checkInvoice(id));
    }

    /**
     * 发票报销
     */
    @PostMapping("/{id}/reimburse")
    @Permission(code = "reimburse", name = "发票报销")
    public Result<Boolean> reimburseInvoice(@PathVariable Long id) {
        return Result.success(invoiceService.reimburseInvoice(id));
    }

    /**
     * 发票作废
     */
    @PostMapping("/{id}/void")
    @Permission(code = "void", name = "发票作废")
    public Result<Boolean> voidInvoice(@PathVariable Long id) {
        return Result.success(invoiceService.voidInvoice(id));
    }

    /**
     * 获取待勾选发票列表（采购）
     */
    @GetMapping("/unchecked/purchase")
    @Permission(code = "read", name = "查看发票")
    public Result<List<Invoice>> getUncheckedPurchaseInvoices() {
        return Result.success(invoiceService.getUncheckedPurchaseInvoices());
    }

    /**
     * 获取待勾选发票列表（销售）
     */
    @GetMapping("/unchecked/sales")
    @Permission(code = "read", name = "查看发票")
    public Result<List<Invoice>> getUncheckedSalesInvoices() {
        return Result.success(invoiceService.getUncheckedSalesInvoices());
    }

    /**
     * 发票统计
     */
    @GetMapping("/statistics")
    @Permission(code = "read", name = "查看发票")
    public Result<InvoiceStatistics> getStatistics() {
        return Result.success(invoiceService.getStatistics());
    }
}