package com.ims.system.service;

import com.ims.customer.entity.Customer;
import com.ims.product.entity.Product;
import com.ims.procurement.entity.Supplier;
import java.util.List;

/**
 * 数据导入导出服务接口
 */
public interface DataExportService {

    /**
     * 导出客户数据
     */
    String exportCustomers(List<Long> ids);

    /**
     * 导出供应商数据
     */
    String exportSuppliers(List<Long> ids);

    /**
     * 导出商品数据
     */
    String exportProducts(List<Long> ids);
}