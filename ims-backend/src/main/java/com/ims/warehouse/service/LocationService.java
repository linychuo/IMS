package com.ims.warehouse.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.warehouse.entity.Location;

import java.util.List;

/**
 * 库位Service
 */
public interface LocationService extends IService<Location> {

    /**
     * 按仓库查询库位
     */
    List<Location> selectByWarehouse(Long warehouseId);

    /**
     * 按库区查询库位
     */
    List<Location> selectByZone(Long warehouseId, String zone);
}