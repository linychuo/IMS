package com.ims.system.service.impl;

import com.ims.common.util.ExcelImporter;
import com.ims.customer.entity.Customer;
import com.ims.customer.mapper.CustomerMapper;
import com.ims.product.entity.Product;
import com.ims.product.mapper.ProductMapper;
import com.ims.procurement.entity.Supplier;
import com.ims.procurement.mapper.SupplierMapper;
import com.ims.system.service.DataImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 数据导入服务实现
 */
@Service
public class DataImportServiceImpl implements DataImportService {

    @Autowired
    private CustomerMapper customerMapper;

    @Autowired
    private SupplierMapper supplierMapper;

    @Autowired
    private ProductMapper productMapper;

    @Override
    public Map<String, Object> importCustomers(String fileContent) {
        Map<String, Object> result = new HashMap<>();
        List<String> errors = new ArrayList<>();
        int successCount = 0;

        try {
            byte[] bytes = fileContent.getBytes("UTF-8");
            ExcelImporter importer = new ExcelImporter(bytes);
            List<String[]> rows = importer.readAllRows();
            if (rows.size() <= 1) {
                errors.add("文件无数据或格式错误");
                result.put("successCount", 0);
                result.put("errorCount", errors.size());
                result.put("errors", errors);
                return result;
            }

            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                try {
                    if (row.length < 10) {
                        errors.add("第" + (i + 1) + "行: 列数不足");
                        continue;
                    }
                    String code = row[0].trim();
                    String name = row[1].trim();
                    if (code.isEmpty() || name.isEmpty()) {
                        errors.add("第" + (i + 1) + "行: 客户编号或名称不能为空");
                        continue;
                    }
                    Customer c = new Customer();
                    c.setCode(code);
                    c.setName(name);
                    if (row.length > 2) c.setContact(row[2].trim());
                    if (row.length > 3) c.setPhone(row[3].trim());
                    if (row.length > 4) c.setMobile(row[4].trim());
                    if (row.length > 5) c.setEmail(row[5].trim());
                    if (row.length > 6) c.setAddress(row[6].trim());
                    if (row.length > 7 && !row[7].trim().isEmpty()) c.setLevel(Integer.parseInt(row[7].trim()));
                    if (row.length > 8 && !row[8].trim().isEmpty()) c.setCreditLimit(new BigDecimal(row[8].trim()));
                    if (row.length > 9) c.setStatus("启用".equals(row[9].trim()) ? 1 : 0);
                    c.setCreateTime(LocalDateTime.now());
                    customerMapper.insert(c);
                    successCount++;
                } catch (Exception e) {
                    errors.add("第" + (i + 1) + "行: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            errors.add("文件解析失败: " + e.getMessage());
        }

        result.put("success", successCount);
        result.put("failed", errors.size());
        result.put("errors", errors);
        return result;
    }

    @Override
    public Map<String, Object> importSuppliers(String fileContent) {
        Map<String, Object> result = new HashMap<>();
        List<String> errors = new ArrayList<>();
        int successCount = 0;
        int totalRows = 0;

        try {
            byte[] bytes = fileContent.getBytes("UTF-8");
            ExcelImporter importer = new ExcelImporter(bytes);
            List<String[]> rows = importer.readAllRows();
            totalRows = rows.size();
            if (rows.size() <= 1) {
                errors.add("文件无数据或格式错误");
                result.put("success", 0);
                result.put("failed", 0);
                result.put("errors", errors);
                return result;
            }

            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                try {
                    if (row.length < 6) {
                        errors.add("第" + (i + 1) + "行: 列数不足");
                        continue;
                    }
                    String code = row[0].trim();
                    String name = row[1].trim();
                    if (code.isEmpty() || name.isEmpty()) {
                        errors.add("第" + (i + 1) + "行: 供应商编号或名称不能为空");
                        continue;
                    }
                    Supplier s = new Supplier();
                    s.setSupplierCode(code);
                    s.setSupplierName(name);
                    if (row.length > 2) s.setContact(row[2].trim());
                    if (row.length > 3) s.setPhone(row[3].trim());
                    if (row.length > 4) s.setAddress(row[4].trim());
                    if (row.length > 5) s.setStatus("启用".equals(row[5].trim()) ? 1 : 0);
                    supplierMapper.insert(s);
                    successCount++;
                } catch (Exception e) {
                    errors.add("第" + (i + 1) + "行: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            errors.add("文件解析失败: " + e.getMessage());
        }

        result.put("success", successCount);
        result.put("failed", totalRows > 0 ? totalRows - 1 - successCount : 0);
        result.put("errors", errors);
        return result;
    }

    @Override
    public Map<String, Object> importProducts(String fileContent) {
        Map<String, Object> result = new HashMap<>();
        List<String> errors = new ArrayList<>();
        int successCount = 0;
        int totalRows = 0;

        try {
            byte[] bytes = fileContent.getBytes("UTF-8");
            ExcelImporter importer = new ExcelImporter(bytes);
            List<String[]> rows = importer.readAllRows();
            totalRows = rows.size();
            if (rows.size() <= 1) {
                errors.add("文件无数据或格式错误");
                result.put("success", 0);
                result.put("failed", 0);
                result.put("errors", errors);
                return result;
            }

            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                try {
                    if (row.length < 11) {
                        errors.add("第" + (i + 1) + "行: 列数不足");
                        continue;
                    }
                    String code = row[0].trim();
                    String name = row[1].trim();
                    if (code.isEmpty() || name.isEmpty()) {
                        errors.add("第" + (i + 1) + "行: 商品编号或名称不能为空");
                        continue;
                    }
                    Product p = new Product();
                    p.setCode(code);
                    p.setName(name);
                    if (row.length > 2 && !row[2].trim().isEmpty()) p.setCategoryId(row[2].trim());
                    if (row.length > 3) p.setSpec(row[3].trim());
                    if (row.length > 4) p.setUnit(row[4].trim());
                    if (row.length > 5) p.setBarcode(row[5].trim());
                    if (row.length > 6 && !row[6].trim().isEmpty()) p.setPurchasePrice(new BigDecimal(row[6].trim()));
                    if (row.length > 7 && !row[7].trim().isEmpty()) p.setSalePrice(new BigDecimal(row[7].trim()));
                    if (row.length > 8 && !row[8].trim().isEmpty()) p.setMinSalePrice(new BigDecimal(row[8].trim()));
                    if (row.length > 9 && !row[9].trim().isEmpty()) p.setStockWarning(Integer.parseInt(row[9].trim()));
                    if (row.length > 10) p.setStatus("启用".equals(row[10].trim()) ? 1 : 0);
                    p.setCreateTime(LocalDateTime.now());
                    productMapper.insert(p);
                    successCount++;
                } catch (Exception e) {
                    errors.add("第" + (i + 1) + "行: " + e.getMessage());
                }
            }
        } catch (Exception e) {
            errors.add("文件解析失败: " + e.getMessage());
        }

        result.put("success", successCount);
        result.put("failed", totalRows > 0 ? totalRows - 1 - successCount : 0);
        result.put("errors", errors);
        return result;
    }
}