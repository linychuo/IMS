package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.service.DataExportService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 数据导入导出 Controller
 */
@RestController
@RequestMapping("/api/system/export")
@Permission(code = "system:export", name = "数据导入导出")
public class DataExportController {

    @Autowired
    private DataExportService dataExportService;

    /**
     * 导出客户Excel
     */
    @GetMapping("/customers/excel")
    @Permission(code = "read", name = "导出客户")
    public Result<byte[]> exportCustomers(@RequestParam(required = false) List<Long> ids) {
        return Result.success(dataExportService.exportCustomersExcel(ids));
    }

    /**
     * 导出供应商Excel
     */
    @GetMapping("/suppliers/excel")
    @Permission(code = "read", name = "导出供应商")
    public Result<byte[]> exportSuppliers(@RequestParam(required = false) List<Long> ids) {
        return Result.success(dataExportService.exportSuppliersExcel(ids));
    }

    /**
     * 导出商品Excel
     */
    @GetMapping("/products/excel")
    @Permission(code = "read", name = "导出商品")
    public Result<byte[]> exportProducts(@RequestParam(required = false) List<Long> ids) {
        return Result.success(dataExportService.exportProductsExcel(ids));
    }

    /**
     * 获取客户导入模板
     */
    @GetMapping("/template/customer")
    @Permission(code = "read", name = "下载模板")
    public Result<byte[]> getCustomerTemplate() {
        return Result.success(dataExportService.getCustomerTemplate());
    }

    /**
     * 获取供应商导入模板
     */
    @GetMapping("/template/supplier")
    @Permission(code = "read", name = "下载模板")
    public Result<byte[]> getSupplierTemplate() {
        return Result.success(dataExportService.getSupplierTemplate());
    }

    /**
     * 获取商品导入模板
     */
    @GetMapping("/template/product")
    @Permission(code = "read", name = "下载模板")
    public Result<byte[]> getProductTemplate() {
        return Result.success(dataExportService.getProductTemplate());
    }

    /**
     * 获取库存导入模板
     */
    @GetMapping("/template/inventory")
    @Permission(code = "read", name = "下载模板")
    public Result<byte[]> getInventoryTemplate() {
        return Result.success(dataExportService.getInventoryTemplate());
    }
}