package com.ims.system.service.impl;

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
    public Map<String, Object> importCustomers(String csvContent) {
        Map<String, Object> result = new HashMap<>();
        List<String> errors = new ArrayList<>();
        int successCount = 0;

        try {
            List<Customer> customers = parseCustomers(csvContent, errors);
            for (Customer customer : customers) {
                try {
                    customerMapper.insert(customer);
                    successCount++;
                } catch (Exception e) {
                    errors.add("插入失败: " + customer.getCode() + " - " + e.getMessage());
                }
            }
        } catch (Exception e) {
            errors.add("解析失败: " + e.getMessage());
        }

        result.put("successCount", successCount);
        result.put("errorCount", errors.size());
        result.put("errors", errors);
        return result;
    }

    @Override
    public Map<String, Object> importSuppliers(String csvContent) {
        Map<String, Object> result = new HashMap<>();
        List<String> errors = new ArrayList<>();
        int successCount = 0;

        try {
            List<Supplier> suppliers = parseSuppliers(csvContent, errors);
            for (Supplier supplier : suppliers) {
                try {
                    supplierMapper.insert(supplier);
                    successCount++;
                } catch (Exception e) {
                    errors.add("插入失败: " + supplier.getCode() + " - " + e.getMessage());
                }
            }
        } catch (Exception e) {
            errors.add("解析失败: " + e.getMessage());
        }

        result.put("successCount", successCount);
        result.put("errorCount", errors.size());
        result.put("errors", errors);
        return result;
    }

    @Override
    public Map<String, Object> importProducts(String csvContent) {
        Map<String, Object> result = new HashMap<>();
        List<String> errors = new ArrayList<>();
        int successCount = 0;

        try {
            List<Product> products = parseProducts(csvContent, errors);
            for (Product product : products) {
                try {
                    productMapper.insert(product);
                    successCount++;
                } catch (Exception e) {
                    errors.add("插入失败: " + product.getCode() + " - " + e.getMessage());
                }
            }
        } catch (Exception e) {
            errors.add("解析失败: " + e.getMessage());
        }

        result.put("successCount", successCount);
        result.put("errorCount", errors.size());
        result.put("errors", errors);
        return result;
    }

    private List<String[]> parseCsvLines(String content) {
        List<String[]> lines = new ArrayList<>();
        String[] rows = content.split("\n");
        for (String row : rows) {
            if (row.trim().isEmpty()) continue;
            List<String> cols = new ArrayList<>();
            boolean inQuote = false;
            StringBuilder current = new StringBuilder();
            for (char c : row.toCharArray()) {
                if (c == '"') {
                    inQuote = !inQuote;
                } else if (c == ',' && !inQuote) {
                    cols.add(current.toString().trim());
                    current = new StringBuilder();
                } else {
                    current.append(c);
                }
            }
            cols.add(current.toString().trim());
            lines.add(cols.toArray(new String[0]));
        }
        return lines;
    }

    private List<Customer> parseCustomers(String csvContent, List<String> errors) {
        List<Customer> customers = new ArrayList<>();
        try {
            List<String[]> rows = parseCsvLines(csvContent);
            if (rows.isEmpty()) return customers;

            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                if (row.length < 8) {
                    errors.add("行" + (i + 1) + ": 列数不足");
                    continue;
                }
                Customer c = new Customer();
                c.setCode(getOrNull(row, 0));
                c.setName(getOrNull(row, 1));
                c.setContact(getOrNull(row, 2));
                c.setPhone(getOrNull(row, 3));
                c.setMobile(getOrNull(row, 4));
                c.setEmail(getOrNull(row, 5));
                c.setAddress(getOrNull(row, 6));
                c.setLevel(row.length > 7 && isNumeric(row[7]) ? Integer.parseInt(row[7]) : 1);
                c.setCreditLimit(row.length > 8 && isNumeric(row[8]) ? new BigDecimal(row[8]) : BigDecimal.ZERO);
                c.setStatus(1);
                customers.add(c);
            }
        } catch (Exception e) {
            errors.add("CSV解析失败: " + e.getMessage());
        }
        return customers;
    }

    private List<Supplier> parseSuppliers(String csvContent, List<String> errors) {
        List<Supplier> suppliers = new ArrayList<>();
        try {
            List<String[]> rows = parseCsvLines(csvContent);
            if (rows.isEmpty()) return suppliers;

            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                if (row.length < 5) {
                    errors.add("行" + (i + 1) + ": 列数不足");
                    continue;
                }
                Supplier s = new Supplier();
                s.setCode(getOrNull(row, 0));
                s.setName(getOrNull(row, 1));
                s.setContact(getOrNull(row, 2));
                s.setPhone(getOrNull(row, 3));
                s.setAddress(getOrNull(row, 4));
                s.setStatus(1);
                suppliers.add(s);
            }
        } catch (Exception e) {
            errors.add("CSV解析失败: " + e.getMessage());
        }
        return suppliers;
    }

    private List<Product> parseProducts(String csvContent, List<String> errors) {
        List<Product> products = new ArrayList<>();
        try {
            List<String[]> rows = parseCsvLines(csvContent);
            if (rows.isEmpty()) return products;

            for (int i = 1; i < rows.size(); i++) {
                String[] row = rows.get(i);
                if (row.length < 10) {
                    errors.add("行" + (i + 1) + ": 列数不足");
                    continue;
                }
                Product p = new Product();
                p.setCode(getOrNull(row, 0));
                p.setName(getOrNull(row, 1));
                p.setCategoryId(getOrNull(row, 2));
                p.setSpec(getOrNull(row, 3));
                p.setUnit(getOrNull(row, 4));
                p.setBarcode(getOrNull(row, 5));
                p.setPurchasePrice(row.length > 6 && isNumeric(row[6]) ? new BigDecimal(row[6]) : BigDecimal.ZERO);
                p.setSalePrice(row.length > 7 && isNumeric(row[7]) ? new BigDecimal(row[7]) : BigDecimal.ZERO);
                p.setMinSalePrice(row.length > 8 && isNumeric(row[8]) ? new BigDecimal(row[8]) : BigDecimal.ZERO);
                p.setStockWarning(row.length > 9 && isNumeric(row[9]) ? Integer.parseInt(row[9]) : 0);
                p.setStatus(1);
                products.add(p);
            }
        } catch (Exception e) {
            errors.add("CSV解析失败: " + e.getMessage());
        }
        return products;
    }

    private String getOrNull(String[] arr, int idx) {
        return idx < arr.length && arr[idx] != null && !arr[idx].trim().isEmpty() ? arr[idx].trim() : null;
    }

    private boolean isNumeric(String str) {
        if (str == null || str.trim().isEmpty()) return false;
        try {
            Double.parseDouble(str.trim());
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }
}