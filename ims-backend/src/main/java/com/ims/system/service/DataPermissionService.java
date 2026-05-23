package com.ims.system.service;

import java.util.List;

/**
 * 数据权限服务接口
 */
public interface DataPermissionService {

    /**
     * 获取用户可访问的仓库ID列表
     * @param userId 用户ID
     * @return 仓库ID列表，如果为空表示可访问所有
     */
    List<Long> getUserWarehouseIds(Long userId);

    /**
     * 检查用户是否有权限访问指定仓库
     */
    boolean canAccessWarehouse(Long userId, Long warehouseId);

    /**
     * 获取用户数据权限范围
     * @return 1=全部数据, 2=本部门数据, 3=个人数据
     */
    Integer getUserDataScope(Long userId);

    /**
     * 为查询条件添加数据权限过滤
     * 返回的SQL条件片段，如 "warehouse_id IN (1,2,3)" 或 "1=1"（不限制）
     */
    String getWarehouseFilterCondition(Long userId);
}