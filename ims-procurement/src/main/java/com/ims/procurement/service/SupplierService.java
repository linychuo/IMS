package com.ims.procurement.service;

import com.ims.procurement.entity.Supplier;

import java.util.List;

/**
 * 供应商服务接口
 */
public interface SupplierService {

    /**
     * 创建供应商
     */
    Supplier create(Supplier supplier);

    /**
     * 更新供应商
     */
    Supplier update(Supplier supplier);

    /**
     * 根据ID查询
     */
    Supplier getById(String id);

    /**
     * 根据编码查询
     */
    Supplier getByCode(String supplierCode);

    /**
     * 查询列表
     */
    List<Supplier> list(Supplier query);

    /**
     * 删除
     */
    void delete(String id);
}