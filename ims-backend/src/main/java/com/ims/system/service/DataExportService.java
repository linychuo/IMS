package com.ims.system.service;

import com.ims.common.util.ExcelImporter;
import com.ims.customer.entity.Customer;
import com.ims.product.entity.Product;
import com.ims.procurement.entity.Supplier;
import java.util.List;

/**
 * 数据导入导出服务接口
 */
public interface DataExportService {

    /**
     * 导出客户数据(Excel)
     */
    byte[] exportCustomersExcel(List<Long> ids);

    /**
     * 导出供应商数据(Excel)
     */
    byte[] exportSuppliersExcel(List<Long> ids);

    /**
     * 导出商品数据(Excel)
     */
    byte[] exportProductsExcel(List<Long> ids);

    /**
     * 获取客户导入模板
     */
    byte[] getCustomerTemplate();

    /**
     * 获取供应商导入模板
     */
    byte[] getSupplierTemplate();

    /**
     * 获取商品导入模板
     */
    byte[] getProductTemplate();

    /**
     * 获取库存导入模板
     */
    byte[] getInventoryTemplate();

    /**
     * 导入客户数据
     */
    ExcelImporter.ImportResult importCustomers(byte[] bytes);

    /**
     * 导入供应商数据
     */
    ExcelImporter.ImportResult importSuppliers(byte[] bytes);

    /**
     * 导入商品数据
     */
    ExcelImporter.ImportResult importProducts(byte[] bytes);
}