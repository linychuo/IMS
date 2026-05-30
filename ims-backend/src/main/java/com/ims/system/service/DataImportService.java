package com.ims.system.service;

import java.util.List;
import java.util.Map;

/**
 * 数据导入服务接口
 */
public interface DataImportService {

    /**
     * 导入客户数据
     */
    Map<String, Object> importCustomers(String fileContent);

    /**
     * 导入供应商数据
     */
    Map<String, Object> importSuppliers(String fileContent);

    /**
     * 导入商品数据
     */
    Map<String, Object> importProducts(String fileContent);
}