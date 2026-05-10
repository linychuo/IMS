package com.ims.system.mapper;

import com.ims.system.entity.SysRolePermission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 角色权限Mapper
 */
@Mapper
public interface SysRolePermissionMapper {

    /**
     * 根据角色ID删除所有权限
     */
    int deleteByRoleId(@Param("roleId") Long roleId);

    /**
     * 批量插入角色权限
     */
    int batchInsert(@Param("list") List<SysRolePermission> list);

    /**
     * 根据角色ID查询权限ID列表
     */
    List<Long> selectPermissionIdsByRoleId(@Param("roleId") Long roleId);
}
