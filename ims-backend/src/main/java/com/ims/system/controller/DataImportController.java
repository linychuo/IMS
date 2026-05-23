package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.service.DataImportService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 数据导入 Controller
 */
@RestController
@RequestMapping("/api/system/import")
@Permission(code = "system:import", name = "数据导入")
public class DataImportController {

    @Autowired
    private DataImportService dataImportService;

    @PostMapping("/customers")
    @Permission(code = "create", name = "导入客户")
    public Result<Map<String, Object>> importCustomers(@RequestBody String csvContent) {
        return Result.success(dataImportService.importCustomers(csvContent));
    }

    @PostMapping("/suppliers")
    @Permission(code = "create", name = "导入供应商")
    public Result<Map<String, Object>> importSuppliers(@RequestBody String csvContent) {
        return Result.success(dataImportService.importSuppliers(csvContent));
    }

    @PostMapping("/products")
    @Permission(code = "create", name = "导入商品")
    public Result<Map<String, Object>> importProducts(@RequestBody String csvContent) {
        return Result.success(dataImportService.importProducts(csvContent));
    }
}