package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.service.DataExportService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 数据导出 Controller
 */
@RestController
@RequestMapping("/api/system/export")
@Permission(code = "system:export", name = "数据导出")
public class DataExportController {

    @Autowired
    private DataExportService dataExportService;

    @GetMapping("/customers")
    @Permission(code = "read", name = "导出客户")
    public Result<String> exportCustomers(@RequestParam(required = false) List<Long> ids) {
        return Result.success(dataExportService.exportCustomers(ids));
    }

    @GetMapping("/suppliers")
    @Permission(code = "read", name = "导出供应商")
    public Result<String> exportSuppliers(@RequestParam(required = false) List<Long> ids) {
        return Result.success(dataExportService.exportSuppliers(ids));
    }

    @GetMapping("/products")
    @Permission(code = "read", name = "导出商品")
    public Result<String> exportProducts(@RequestParam(required = false) List<Long> ids) {
        return Result.success(dataExportService.exportProducts(ids));
    }
}