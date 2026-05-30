package com.ims.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ims.common.util.ExcelExporter;
import com.ims.common.util.ExcelImporter;
import com.ims.customer.entity.Customer;
import com.ims.customer.mapper.CustomerMapper;
import com.ims.product.entity.Product;
import com.ims.product.mapper.ProductMapper;
import com.ims.procurement.entity.Supplier;
import com.ims.procurement.mapper.SupplierMapper;
import com.ims.system.service.DataExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 数据导入导出服务实现
 */
@Service
public class DataExportServiceImpl implements DataExportService {

    @Autowired
    private CustomerMapper customerMapper;

    @Autowired
    private SupplierMapper supplierMapper;

    @Autowired
    private ProductMapper productMapper;

    @Override
    public byte[] exportCustomersExcel(List<Long> ids) {
        List<Customer> customers;
        if (ids != null && !ids.isEmpty()) {
            customers = customerMapper.selectList(new LambdaQueryWrapper<Customer>().in(Customer::getId, ids));
        } else {
            customers = customerMapper.selectList(null);
        }

        ExcelExporter exporter = new ExcelExporter();
        exporter.writeHeader(new String[]{"客户编号", "客户名称", "联系人", "电话", "手机", "邮箱", "地址", "等级", "信用额度", "状态"});
        for (Customer c : customers) {
            exporter.writeRow(new Object[]{
                c.getCode(), c.getName(), c.getContact(), c.getPhone(),
                c.getMobile(), c.getEmail(), c.getAddress(), c.getLevel(),
                c.getCreditLimit(), c.getStatus() != null && c.getStatus() == 1 ? "启用" : "禁用"
            });
        }
        try {
            return exporter.toBytes();
        } catch (Exception e) {
            throw new RuntimeException("导出客户Excel失败", e);
        }
    }

    @Override
    public byte[] exportSuppliersExcel(List<Long> ids) {
        List<Supplier> suppliers;
        if (ids != null && !ids.isEmpty()) {
            suppliers = supplierMapper.selectList(new Supplier());
        } else {
            suppliers = supplierMapper.selectList(null);
        }

        ExcelExporter exporter = new ExcelExporter();
        exporter.writeHeader(new String[]{"供应商编号", "供应商名称", "联系人", "电话", "地址", "状态"});
        for (Supplier s : suppliers) {
            exporter.writeRow(new Object[]{
                s.getSupplierCode(), s.getSupplierName(), s.getContact(), s.getPhone(),
                s.getAddress(), s.getStatus() != null && s.getStatus() == 1 ? "启用" : "禁用"
            });
        }
        try {
            return exporter.toBytes();
        } catch (Exception e) {
            throw new RuntimeException("导出供应商Excel失败", e);
        }
    }

    @Override
    public byte[] exportProductsExcel(List<Long> ids) {
        List<Product> products;
        if (ids != null && !ids.isEmpty()) {
            products = productMapper.selectList(new LambdaQueryWrapper<Product>().in(Product::getId, ids));
        } else {
            products = productMapper.selectList(null);
        }

        ExcelExporter exporter = new ExcelExporter();
        exporter.writeHeader(new String[]{"商品编号", "商品名称", "分类ID", "规格", "单位", "条形码", "采购价", "销售价", "最低售价", "库存预警", "状态"});
        for (Product p : products) {
            exporter.writeRow(new Object[]{
                p.getCode(), p.getName(), p.getCategoryId(), p.getSpec(),
                p.getUnit(), p.getBarcode(), p.getPurchasePrice(),
                p.getSalePrice(), p.getMinSalePrice(), p.getStockWarning(),
                p.getStatus() != null && p.getStatus() == 1 ? "启用" : "禁用"
            });
        }
        try {
            return exporter.toBytes();
        } catch (Exception e) {
            throw new RuntimeException("导出商品Excel失败", e);
        }
    }

    @Override
    public byte[] getCustomerTemplate() {
        ExcelExporter exporter = new ExcelExporter();
        exporter.writeHeader(new String[]{"客户编号", "客户名称", "联系人", "电话", "手机", "邮箱", "地址", "等级", "信用额度", "状态"});
        exporter.writeRow(new Object[]{"C001", "示例客户", "张三", "010-12345678", "13800138000", "test@example.com", "北京市朝阳区", "1", "50000", "启用"});
        try {
            return exporter.toBytes();
        } catch (Exception e) {
            throw new RuntimeException("生成客户模板失败", e);
        }
    }

    @Override
    public byte[] getSupplierTemplate() {
        ExcelExporter exporter = new ExcelExporter();
        exporter.writeHeader(new String[]{"供应商编号", "供应商名称", "联系人", "电话", "地址", "状态"});
        exporter.writeRow(new Object[]{"S001", "示例供应商", "李四", "010-87654321", "上海市浦东新区", "启用"});
        try {
            return exporter.toBytes();
        } catch (Exception e) {
            throw new RuntimeException("生成供应商模板失败", e);
        }
    }

    @Override
    public byte[] getProductTemplate() {
        ExcelExporter exporter = new ExcelExporter();
        exporter.writeHeader(new String[]{"商品编号", "商品名称", "分类ID", "规格", "单位", "条形码", "采购价", "销售价", "最低售价", "库存预警", "状态"});
        exporter.writeRow(new Object[]{"P001", "示例商品", "1", "规格A", "件", "6901234567890", "100.00", "200.00", "150.00", "10", "启用"});
        try {
            return exporter.toBytes();
        } catch (Exception e) {
            throw new RuntimeException("生成商品模板失败", e);
        }
    }

    @Override
    public byte[] getInventoryTemplate() {
        ExcelExporter exporter = new ExcelExporter();
        exporter.writeHeader(new String[]{"仓库ID", "库位ID", "商品编号", "批次号", "数量", "成本", "生产日期", "有效期"});
        exporter.writeRow(new Object[]{"1", "1", "P001", "BATCH001", "100", "50.00", "2025-01-01", "2026-01-01"});
        try {
            return exporter.toBytes();
        } catch (Exception e) {
            throw new RuntimeException("生成库存模板失败", e);
        }
    }

    @Override
    public ExcelImporter.ImportResult importCustomers(byte[] bytes) {
        try {
            ExcelImporter importer = new ExcelImporter(bytes);
            List<String[]> rows = importer.readAllRows();
            if (rows.size() <= 1) {
                return createResult(0, 0, List.of("文件无数据"));
            }
            int success = 0;
            int failed = 0;
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                try {
                    Customer customer = new Customer();
                    customer.setCode(row[0].trim());
                    customer.setName(row[1].trim());
                    if (row.length > 2) customer.setContact(row[2].trim());
                    if (row.length > 3) customer.setPhone(row[3].trim());
                    if (row.length > 4) customer.setMobile(row[4].trim());
                    if (row.length > 5) customer.setEmail(row[5].trim());
                    if (row.length > 6) customer.setAddress(row[6].trim());
                    if (row.length > 7 && !row[7].trim().isEmpty()) customer.setLevel(Integer.parseInt(row[7].trim()));
                    if (row.length > 8 && !row[8].trim().isEmpty()) customer.setCreditLimit(new BigDecimal(row[8].trim()));
                    if (row.length > 9) customer.setStatus("启用".equals(row[9].trim()) ? 1 : 0);
                    customer.setCreateTime(LocalDateTime.now());
                    customerMapper.insert(customer);
                    success++;
                } catch (Exception e) {
                    failed++;
                }
            }
            return createResult(success, failed, List.of());
        } catch (Exception e) {
            return createResult(0, 0, List.of("文件解析失败: " + e.getMessage()));
        }
    }

    @Override
    public ExcelImporter.ImportResult importSuppliers(byte[] bytes) {
        try {
            ExcelImporter importer = new ExcelImporter(bytes);
            List<String[]> rows = importer.readAllRows();
            if (rows.size() <= 1) {
                return createResult(0, 0, List.of("文件无数据"));
            }
            int success = 0;
            int failed = 0;
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                try {
                    Supplier supplier = new Supplier();
                    supplier.setSupplierCode(row[0].trim());
                    supplier.setSupplierName(row[1].trim());
                    if (row.length > 2) supplier.setContact(row[2].trim());
                    if (row.length > 3) supplier.setPhone(row[3].trim());
                    if (row.length > 4) supplier.setAddress(row[4].trim());
                    if (row.length > 5) supplier.setStatus("启用".equals(row[5].trim()) ? 1 : 0);
                    supplierMapper.insert(supplier);
                    success++;
                } catch (Exception e) {
                    failed++;
                }
            }
            return createResult(success, failed, List.of());
        } catch (Exception e) {
            return createResult(0, 0, List.of("文件解析失败: " + e.getMessage()));
        }
    }

    @Override
    public ExcelImporter.ImportResult importProducts(byte[] bytes) {
        try {
            ExcelImporter importer = new ExcelImporter(bytes);
            List<String[]> rows = importer.readAllRows();
            if (rows.size() <= 1) {
                return createResult(0, 0, List.of("文件无数据"));
            }
            int success = 0;
            int failed = 0;
            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                try {
                    Product product = new Product();
                    product.setCode(row[0].trim());
                    product.setName(row[1].trim());
                    if (row.length > 2 && !row[2].trim().isEmpty()) product.setCategoryId(row[2].trim());
                    if (row.length > 3) product.setSpec(row[3].trim());
                    if (row.length > 4) product.setUnit(row[4].trim());
                    if (row.length > 5) product.setBarcode(row[5].trim());
                    if (row.length > 6 && !row[6].trim().isEmpty()) product.setPurchasePrice(new BigDecimal(row[6].trim()));
                    if (row.length > 7 && !row[7].trim().isEmpty()) product.setSalePrice(new BigDecimal(row[7].trim()));
                    if (row.length > 8 && !row[8].trim().isEmpty()) product.setMinSalePrice(new BigDecimal(row[8].trim()));
                    if (row.length > 9 && !row[9].trim().isEmpty()) product.setStockWarning(Integer.parseInt(row[9].trim()));
                    if (row.length > 10) product.setStatus("启用".equals(row[10].trim()) ? 1 : 0);
                    product.setCreateTime(LocalDateTime.now());
                    productMapper.insert(product);
                    success++;
                } catch (Exception e) {
                    failed++;
                }
            }
            return createResult(success, failed, List.of());
        } catch (Exception e) {
            return createResult(0, 0, List.of("文件解析失败: " + e.getMessage()));
        }
    }

    private ExcelImporter.ImportResult createResult(int success, int failed, List<String> errors) {
        ExcelImporter.ImportResult result = new ExcelImporter.ImportResult();
        result.setSuccess(success);
        result.setFailed(failed);
        result.setErrors(errors);
        return result;
    }
}