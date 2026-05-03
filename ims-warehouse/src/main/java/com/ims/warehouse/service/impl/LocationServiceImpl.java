package com.ims.warehouse.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.warehouse.entity.Location;
import com.ims.warehouse.mapper.LocationMapper;
import com.ims.warehouse.service.LocationService;
import org.springframework.stereotype.Service;

/**
 * 库位Service实现
 */
@Service
public class LocationServiceImpl extends ServiceImpl<LocationMapper, Location> implements LocationService {
}