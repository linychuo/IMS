package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.service.DataImportService;
import com.ims.system.annotation.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    /**
     * 导入客户(Excel)
     */
    @PostMapping("/customers")
    @Permission(code = "create", name = "导入客户")
    public Result<Map<String, Object>> importCustomers(@RequestParam("file") MultipartFile file) {
        try {
            String content = new String(file.getBytes(), "UTF-8");
            return Result.success(dataImportService.importCustomers(content));
        } catch (Exception e) {
            return Result.success(Map.of("success", 0, "failed", 0, "errors", java.util.List.of("文件处理失败: " + e.getMessage())));
        }
    }

    /**
     * 导入供应商(Excel)
     */
    @PostMapping("/suppliers")
    @Permission(code = "create", name = "导入供应商")
    public Result<Map<String, Object>> importSuppliers(@RequestParam("file") MultipartFile file) {
        try {
            String content = new String(file.getBytes(), "UTF-8");
            return Result.success(dataImportService.importSuppliers(content));
        } catch (Exception e) {
            return Result.success(Map.of("success", 0, "failed", 0, "errors", java.util.List.of("文件处理失败: " + e.getMessage())));
        }
    }

    /**
     * 导入商品(Excel)
     */
    @PostMapping("/products")
    @Permission(code = "create", name = "导入商品")
    public Result<Map<String, Object>> importProducts(@RequestParam("file") MultipartFile file) {
        try {
            String content = new String(file.getBytes(), "UTF-8");
            return Result.success(dataImportService.importProducts(content));
        } catch (Exception e) {
            return Result.success(Map.of("success", 0, "failed", 0, "errors", java.util.List.of("文件处理失败: " + e.getMessage())));
        }
    }
}