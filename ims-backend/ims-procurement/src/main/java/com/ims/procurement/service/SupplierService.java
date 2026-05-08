package com.ims.procurement.service;

import com.ims.procurement.entity.Supplier;

import java.util.List;

/**
 * 供应商服务接口
 */
public interface SupplierService {

    Supplier create(Supplier supplier);

    Supplier update(Supplier supplier);

    Supplier getById(String id);

    Supplier getByCode(String supplierCode);

    List<Supplier> list(Supplier query);

    void delete(String id);
}
