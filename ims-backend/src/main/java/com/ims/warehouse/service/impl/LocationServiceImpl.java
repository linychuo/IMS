package com.ims.warehouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.warehouse.entity.Location;
import com.ims.warehouse.mapper.LocationMapper;
import com.ims.warehouse.service.LocationService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 库位Service实现
 */
@Service
public class LocationServiceImpl extends ServiceImpl<LocationMapper, Location> implements LocationService {

    @Override
    public List<Location> selectByWarehouse(Long warehouseId) {
        LambdaQueryWrapper<Location> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Location::getWarehouseId, warehouseId)
               .eq(Location::getDeleted, 0);
        return this.list(wrapper);
    }

    @Override
    public List<Location> selectByZone(Long warehouseId, String zone) {
        LambdaQueryWrapper<Location> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Location::getWarehouseId, warehouseId)
               .eq(Location::getZone, zone)
               .eq(Location::getDeleted, 0);
        return this.list(wrapper);
    }
}