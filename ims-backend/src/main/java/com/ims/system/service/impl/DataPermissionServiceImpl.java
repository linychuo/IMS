package com.ims.system.service.impl;

import com.ims.system.dto.UserDTO;
import com.ims.system.entity.SysUser;
import com.ims.system.mapper.SysUserWarehouseMapper;
import com.ims.system.service.DataPermissionService;
import com.ims.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 数据权限服务实现
 */
@Service
public class DataPermissionServiceImpl implements DataPermissionService {

    @Autowired
    private SysUserWarehouseMapper userWarehouseMapper;

    @Autowired
    private UserService userService;

    @Override
    public List<Long> getUserWarehouseIds(Long userId) {
        return userWarehouseMapper.selectWarehouseIdsByUserId(userId);
    }

    @Override
    public boolean canAccessWarehouse(Long userId, Long warehouseId) {
        Integer dataScope = getUserDataScope(userId);
        if (dataScope == null || dataScope == 1) {
            return true;
        }
        List<Long> allowedWarehouses = getUserWarehouseIds(userId);
        return allowedWarehouses.contains(warehouseId);
    }

    @Override
    public Integer getUserDataScope(Long userId) {
        UserDTO user = userService.getById(userId);
        if (user == null) {
            return 1;
        }
        return user.getDataScope() != null ? user.getDataScope() : 1;
    }

    @Override
    public String getWarehouseFilterCondition(Long userId) {
        Integer dataScope = getUserDataScope(userId);
        if (dataScope == null || dataScope == 1) {
            return "1=1";
        }
        List<Long> warehouseIds = getUserWarehouseIds(userId);
        if (warehouseIds == null || warehouseIds.isEmpty()) {
            return "1=0";
        }
        return "warehouse_id IN (" + String.join(",", warehouseIds.stream().map(String::valueOf).toList()) + ")";
    }
}