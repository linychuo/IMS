package com.ims.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ims.common.util.CsvExporter;
import com.ims.customer.entity.Customer;
import com.ims.customer.mapper.CustomerMapper;
import com.ims.product.entity.Product;
import com.ims.product.mapper.ProductMapper;
import com.ims.procurement.entity.Supplier;
import com.ims.procurement.mapper.SupplierMapper;
import com.ims.system.service.DataExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 数据导出服务实现
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
    public String exportCustomers(List<Long> ids) {
        List<Customer> customers = customerMapper.selectList(null);

        CsvExporter exporter = new CsvExporter();
        exporter.writeHeader(new String[]{"客户编号", "客户名称", "联系人", "电话", "手机", "邮箱", "地址", "等级", "信用额度", "状态"});
        for (Customer c : customers) {
            exporter.writeRow(new Object[]{
                c.getCode(), c.getName(), c.getContact(), c.getPhone(),
                c.getMobile(), c.getEmail(), c.getAddress(), c.getLevel(),
                c.getCreditLimit(), c.getStatus() != null && c.getStatus() == 1 ? "启用" : "禁用"
            });
        }
        return exporter.toString();
    }

    @Override
    public String exportSuppliers(List<Long> ids) {
        List<Supplier> suppliers = supplierMapper.selectList(null);

        CsvExporter exporter = new CsvExporter();
        exporter.writeHeader(new String[]{"供应商编号", "供应商名称", "联系人", "电话", "地址", "状态"});
        for (Supplier s : suppliers) {
            exporter.writeRow(new Object[]{
                s.getCode(), s.getName(), s.getContact(), s.getPhone(),
                s.getAddress(), s.getStatus() != null && s.getStatus() == 1 ? "启用" : "禁用"
            });
        }
        return exporter.toString();
    }

    @Override
    public String exportProducts(List<Long> ids) {
        List<Product> products = productMapper.selectList(null);

        CsvExporter exporter = new CsvExporter();
        exporter.writeHeader(new String[]{"商品编号", "商品名称", "分类ID", "规格", "单位", "条形码", "采购价", "销售价", "最低售价", "库存预警", "状态"});
        for (Product p : products) {
            exporter.writeRow(new Object[]{
                p.getCode(), p.getName(), p.getCategoryId(), p.getSpec(),
                p.getUnit(), p.getBarcode(), p.getPurchasePrice(),
                p.getSalePrice(), p.getMinSalePrice(), p.getStockWarning(),
                p.getStatus() != null && p.getStatus() == 1 ? "启用" : "禁用"
            });
        }
        return exporter.toString();
    }
}