package com.ims.warehouse.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.warehouse.entity.Warehouse;
import com.ims.warehouse.mapper.WarehouseMapper;
import com.ims.warehouse.service.WarehouseService;
import org.springframework.stereotype.Service;

/**
 * 仓库Service实现
 */
@Service
public class WarehouseServiceImpl extends ServiceImpl<WarehouseMapper, Warehouse> implements WarehouseService {
}