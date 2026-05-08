package com.ims.procurement.service.impl;

import com.ims.procurement.entity.Supplier;
import com.ims.procurement.mapper.SupplierMapper;
import com.ims.procurement.service.SupplierService;
import com.ims.common.util.OrderNoGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 供应商服务实现
 */
@Service
public class SupplierServiceImpl implements SupplierService {

    private static final Logger log = LoggerFactory.getLogger(SupplierServiceImpl.class);

    private final SupplierMapper supplierMapper;

    public SupplierServiceImpl(SupplierMapper supplierMapper) {
        this.supplierMapper = supplierMapper;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Supplier create(Supplier supplier) {
        var existed = supplierMapper.selectByCode(supplier.getSupplierCode());
        if (existed != null) {
            throw new IllegalArgumentException("供应商编码已存在");
        }

        supplier.setId(OrderNoGenerator.generateSimpleUUID());
        supplier.setCreatedAt(LocalDateTime.now());
        supplierMapper.insert(supplier);

        log.info("创建供应商: {}", supplier.getSupplierName());
        return supplier;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Supplier update(Supplier supplier) {
        var existed = supplierMapper.selectById(supplier.getId());
        if (existed == null) {
            throw new IllegalArgumentException("供应商不存在");
        }

        supplier.setUpdatedAt(LocalDateTime.now());
        supplierMapper.update(supplier);

        log.info("更新供应商: {}", supplier.getSupplierName());
        return supplier;
    }

    @Override
    public Supplier getById(String id) {
        return supplierMapper.selectById(id);
    }

    @Override
    public Supplier getByCode(String supplierCode) {
        return supplierMapper.selectByCode(supplierCode);
    }

    @Override
    public List<Supplier> list(Supplier query) {
        return supplierMapper.selectList(query);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(String id) {
        var existed = supplierMapper.selectById(id);
        if (existed == null) {
            throw new IllegalArgumentException("供应商不存在");
        }
        supplierMapper.deleteById(id);
        log.info("删除供应商: {}", existed.getSupplierName());
    }
}
