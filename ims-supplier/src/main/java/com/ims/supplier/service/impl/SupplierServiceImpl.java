package com.ims.supplier.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.supplier.entity.Supplier;
import com.ims.supplier.mapper.SupplierMapper;
import com.ims.supplier.service.SupplierService;
import org.springframework.stereotype.Service;

/**
 * 供应商Service实现
 */
@Service
public class SupplierServiceImpl extends ServiceImpl<SupplierMapper, Supplier> implements SupplierService {
}