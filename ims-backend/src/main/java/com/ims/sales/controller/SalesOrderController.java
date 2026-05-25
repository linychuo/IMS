package com.ims.sales.controller;

import com.ims.core.result.PageResult;
import com.ims.core.result.Result;
import com.ims.sales.dto.SalesOrderRequest;
import com.ims.sales.entity.SalesOrder;
import com.ims.sales.entity.SalesOrderDetail;
import com.ims.sales.entity.SalesOrderStatusHistory;
import com.ims.sales.service.SalesOrderService;
import com.ims.system.annotation.Permission;
import com.ims.system.entity.SysPrintTemplate;
import com.ims.system.service.SysPrintTemplateService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 销售订单控制器
 */
@RestController
@RequestMapping("/api/sales/order")
@Permission(code = "sales:order", name = "销售订单")
public class SalesOrderController {

    private static final Logger log = LoggerFactory.getLogger(SalesOrderController.class);

    private final SalesOrderService salesOrderService;
    private final SysPrintTemplateService printTemplateService;

    public SalesOrderController(SalesOrderService salesOrderService,
                                SysPrintTemplateService printTemplateService) {
        this.salesOrderService = salesOrderService;
        this.printTemplateService = printTemplateService;
    }

    /**
     * 创建订单
     */
    @PostMapping
    @Permission(code = "create", name = "创建销售订单")
    public Result<SalesOrder> create(@RequestBody SalesOrderRequest request) {
        return Result.success(salesOrderService.create(request.getSalesOrder(), request.getDetails()));
    }

    /**
     * 更新订单
     */
    @PutMapping("/{id}")
    @Permission(code = "update", name = "更新销售订单")
    public Result<SalesOrder> update(@PathVariable Long id,
                                              @RequestBody SalesOrderRequest request) {
        return Result.success(salesOrderService.update(id, request.getSalesOrder(), request.getDetails()));
    }

    /**
     * 审核订单
     */
    @PostMapping("/{id}/approve")
    @Permission(code = "audit", name = "审核销售订单")
    public Result<Void> approve(@PathVariable Long id,
                                         @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        String userIdStr = userId != null ? String.valueOf(userId) : "system";
        salesOrderService.approve(id, userIdStr);
        return Result.success(null);
    }

    /**
     * 取消订单
     */
    @PostMapping("/{id}/cancel")
    @Permission(code = "cancel", name = "取消销售订单")
    public Result<Void> cancel(@PathVariable Long id,
                                       @RequestParam(required = false) String reason) {
        salesOrderService.cancel(id, reason != null ? reason : "用户取消");
        return Result.success(null);
    }

    /**
     * 根据ID查询
     */
    @GetMapping("/{id}")
    @Permission(code = "read", name = "查看销售订单")
    public Result<SalesOrder> getById(@PathVariable Long id) {
        return Result.success(salesOrderService.getById(id));
    }

    /**
     * 根据订单号查询
     */
    @GetMapping("/no/{orderNo}")
    @Permission(code = "read", name = "查看销售订单")
    public Result<SalesOrder> getByOrderNo(@PathVariable String orderNo) {
        return Result.success(salesOrderService.getByOrderNo(orderNo));
    }

    /**
     * 查询订单明细
     */
    @GetMapping("/{id}/details")
    @Permission(code = "read", name = "查看销售订单")
    public Result<List<SalesOrderDetail>> getDetails(@PathVariable Long id) {
        return Result.success(salesOrderService.getDetails(id));
    }

    /**
     * 查询列表
     */
    @GetMapping("/list")
    @Permission(code = "read", name = "查看销售订单")
    public Result<List<SalesOrder>> list(@ModelAttribute SalesOrder query) {
        return Result.success(salesOrderService.list(query));
    }

    /**
     * 分页查询
     */
    @GetMapping("/page")
    @Permission(code = "read", name = "查看销售订单")
    public Result<PageResult<SalesOrder>> page(
            @RequestParam(defaultValue = "1") Long current,
            @RequestParam(defaultValue = "10") Long size,
            @ModelAttribute SalesOrder query) {
        return Result.success(salesOrderService.page(current, size, query));
    }

    /**
     * 查询订单状态历史
     */
    @GetMapping("/{id}/status-history")
    @Permission(code = "read", name = "查看销售订单")
    public Result<List<SalesOrderStatusHistory>> getStatusHistory(@PathVariable Long id) {
        return Result.success(salesOrderService.getStatusHistory(id));
    }

    /**
     * 获取打印数据
     */
    @GetMapping("/{id}/print-data")
    @Permission(code = "read", name = "查看销售订单")
    public Result<Map<String, Object>> getPrintData(@PathVariable Long id) {
        SalesOrder order = salesOrderService.getById(id);
        if (order == null) {
            return Result.fail("订单不存在");
        }
        List<SalesOrderDetail> details = salesOrderService.getDetails(id);

        // 获取销售订单类型的默认模板
        SysPrintTemplate defaultTemplate = printTemplateService.getDefaultByType(2);
        List<SysPrintTemplate> templates = printTemplateService.getByType(2);

        Map<String, Object> result = new HashMap<>();
        result.put("order", order);
        result.put("details", details);
        result.put("defaultTemplateId", defaultTemplate != null ? defaultTemplate.getId() : null);
        result.put("templates", templates);
        return Result.success(result);
    }

    /**
     * 打印预览 - 返回HTML页面
     */
    @GetMapping(value = "/{id}/print-preview", produces = "text/html;charset=utf-8")
    @Permission(code = "read", name = "查看销售订单")
    public void printPreview(@PathVariable Long id,
                             @RequestParam(required = false) Long templateId,
                             HttpServletResponse response) throws IOException {
        SalesOrder order = salesOrderService.getById(id);
        if (order == null) {
            response.setContentType("text/html;charset=utf-8");
            response.getWriter().write("<html><body><h1>订单不存在</h1></body></html>");
            return;
        }
        List<SalesOrderDetail> details = salesOrderService.getDetails(id);

        // 获取模板
        SysPrintTemplate template;
        if (templateId != null) {
            template = printTemplateService.getById(templateId);
        } else {
            template = printTemplateService.getDefaultByType(2);
        }

        if (template == null || template.getContent() == null) {
            // 输出默认简单模板
            String html = buildDefaultPrintHtml(order, details);
            response.setContentType("text/html;charset=utf-8");
            response.getWriter().write(html);
            return;
        }

        // 渲染模板
        String html = renderTemplate(template.getContent(), order, details);
        response.setContentType("text/html;charset=utf-8");
        response.getWriter().write(html);
    }

    private String buildDefaultPrintHtml(SalesOrder order, List<SalesOrderDetail> details) {
        StringBuilder sb = new StringBuilder();
        sb.append("<!DOCTYPE html><html><head><meta charset='utf-8'>");
        sb.append("<title>销售订单 - ").append(order.getOrderNo()).append("</title>");
        sb.append("<style>");
        sb.append("body{font-family:'宋体',sans-serif;padding:20px;margin:0;}");
        sb.append("h1{text-align:center;margin-bottom:20px;}");
        sb.append(".header{text-align:center;margin-bottom:30px;}");
        sb.append("table{width:100%;border-collapse:collapse;margin-bottom:20px;}");
        sb.append("th,td{border:1px solid #333;padding:8px;text-align:left;}");
        sb.append("th{background:#f5f5f5;font-weight:bold;}");
        sb.append(".info-table td{padding:5px 10px;}");
        sb.append(".footer{margin-top:30px;text-align:right;}");
        sb.append("</style></head><body>");
        sb.append("<h1>销售订单</h1>");
        sb.append("<table class='info-table'><tr>");
        sb.append("<td style='width:50%'><strong>订单编号：</strong>").append(order.getOrderNo() != null ? order.getOrderNo() : "").append("</td>");
        sb.append("<td style='width:50%'><strong>订单日期：</strong>").append(order.getOrderDate() != null ? order.getOrderDate().toString() : "").append("</td>");
        sb.append("</tr><tr>");
        sb.append("<td><strong>客户：</strong>").append(order.getCustomerName() != null ? order.getCustomerName() : "").append("</td>");
        sb.append("<td><strong>要求交货日期：</strong>").append(order.getExpectedDate() != null ? order.getExpectedDate().toString() : "").append("</td>");
        sb.append("</tr></table>");

        sb.append("<table>");
        sb.append("<thead><tr>");
        sb.append("<th>序号</th><th>商品名称</th><th>规格</th><th>单位</th><th>数量</th><th>单价</th><th>金额</th>");
        sb.append("</tr></thead><tbody>");

        int idx = 1;
        BigDecimal total = BigDecimal.ZERO;
        for (SalesOrderDetail d : details) {
            BigDecimal amount = d.getAmount();
            if (amount == null) amount = BigDecimal.ZERO;
            total = total.add(amount);
            sb.append("<tr>");
            sb.append("<td>").append(idx++).append("</td>");
            sb.append("<td>").append(d.getProductName() != null ? d.getProductName() : "").append("</td>");
            sb.append("<td>").append(d.getSpec() != null ? d.getSpec() : "").append("</td>");
            sb.append("<td>").append(d.getUnit() != null ? d.getUnit() : "").append("</td>");
            sb.append("<td>").append(d.getQuantity()).append("</td>");
            sb.append("<td>¥").append(d.getPrice() != null ? d.getPrice().toString() : "0").append("</td>");
            sb.append("<td>¥").append(amount.toString()).append("</td>");
            sb.append("</tr>");
        }

        sb.append("</tbody></table>");

        sb.append("<table class='info-table' style='width:40%;margin-left:auto;'>");
        sb.append("<tr><td><strong>订单金额：</strong>¥").append(order.getTotalAmount() != null ? order.getTotalAmount().toString() : "0").append("</td></tr>");
        if (order.getDiscountAmount() != null && order.getDiscountAmount().compareTo(BigDecimal.ZERO) > 0) {
            sb.append("<tr><td><strong>优惠金额：</strong>¥").append(order.getDiscountAmount().toString()).append("</td></tr>");
        }
        sb.append("<tr><td><strong>实际金额：</strong><strong>¥").append(order.getNetAmount() != null ? order.getNetAmount().toString() : "0").append("</strong></td></tr>");
        sb.append("</table>");

        if (order.getRemark() != null && !order.getRemark().isEmpty()) {
            sb.append("<p style='margin-top:20px;'><strong>备注：</strong>").append(order.getRemark()).append("</p>");
        }

        sb.append("<div class='footer'>");
        sb.append("<p>审核人：").append(order.getAuditedBy() != null ? order.getAuditedBy() : "").append("</p>");
        sb.append("<p>审核时间：").append(order.getAuditedAt() != null ? order.getAuditedAt().toString() : "").append("</p>");
        sb.append("</div></body></html>");

        return sb.toString();
    }

    private String renderTemplate(String template, SalesOrder order, List<SalesOrderDetail> details) {
        String result = template;

        // 订单级变量替换
        result = replaceVar(result, "orderNo", order.getOrderNo());
        result = replaceVar(result, "customerName", order.getCustomerName());
        result = replaceVar(result, "orderDate", order.getOrderDate() != null ? order.getOrderDate().toString() : "");
        result = replaceVar(result, "expectedDate", order.getExpectedDate() != null ? order.getExpectedDate().toString() : "");
        result = replaceVar(result, "totalAmount", order.getTotalAmount() != null ? order.getTotalAmount().toString() : "0");
        result = replaceVar(result, "discountAmount", order.getDiscountAmount() != null ? order.getDiscountAmount().toString() : "0");
        result = replaceVar(result, "netAmount", order.getNetAmount() != null ? order.getNetAmount().toString() : "0");
        result = replaceVar(result, "remark", order.getRemark() != null ? order.getRemark() : "");
        result = replaceVar(result, "auditedBy", order.getAuditedBy() != null ? order.getAuditedBy() : "");
        result = replaceVar(result, "auditedAt", order.getAuditedAt() != null ? order.getAuditedAt().toString() : "");

        // 明细循环处理（简单替换第一个，后续可以改进为循环替换）
        // 这里先处理单个商品详情，用户可以在模板中使用 ${productName1}, ${productName2} 等
        for (int i = 0; i < details.size(); i++) {
            SalesOrderDetail d = details.get(i);
            int idx = i + 1;
            result = replaceVar(result, "productName" + idx, d.getProductName() != null ? d.getProductName() : "");
            result = replaceVar(result, "spec" + idx, d.getSpec() != null ? d.getSpec() : "");
            result = replaceVar(result, "unit" + idx, d.getUnit() != null ? d.getUnit() : "");
            result = replaceVar(result, "quantity" + idx, d.getQuantity() != null ? d.getQuantity().toString() : "0");
            result = replaceVar(result, "price" + idx, d.getPrice() != null ? d.getPrice().toString() : "0");
            result = replaceVar(result, "amount" + idx, d.getAmount() != null ? d.getAmount().toString() : "0");

            // 也支持没有序号后缀的变量（取第一个）
            if (i == 0) {
                result = replaceVar(result, "productName", d.getProductName() != null ? d.getProductName() : "");
                result = replaceVar(result, "spec", d.getSpec() != null ? d.getSpec() : "");
                result = replaceVar(result, "unit", d.getUnit() != null ? d.getUnit() : "");
                result = replaceVar(result, "quantity", d.getQuantity() != null ? d.getQuantity().toString() : "0");
                result = replaceVar(result, "price", d.getPrice() != null ? d.getPrice().toString() : "0");
                result = replaceVar(result, "amount", d.getAmount() != null ? d.getAmount().toString() : "0");
            }
        }

        return result;
    }

    private String replaceVar(String template, String varName, String value) {
        return template.replace("${" + varName + "}", value != null ? value : "");
    }
}