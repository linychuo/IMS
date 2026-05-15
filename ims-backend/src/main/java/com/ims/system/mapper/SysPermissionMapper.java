package com.ims.system.mapper;

import com.ims.system.entity.SysPermission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 权限Mapper接口
 */
@Mapper
public interface SysPermissionMapper {

    /**
     * 根据权限编码查询
     */
    SysPermission selectByCode(@Param("permissionCode") String permissionCode);

    /**
     * 查询所有权限
     */
    List<SysPermission> selectAll();

    /**
     * 查询所有未删除的权限
     */
    List<SysPermission> selectAllActive();

    /**
     * 查询所有权限（包括已删除的，用于权限同步时检测冲突）
     */
    List<SysPermission> selectAllIncludingDeleted();

    /**
     * 根据父级编码查询子权限
     */
    List<SysPermission> selectByParentCode(@Param("parentCode") String parentCode);

    /**
     * 根据角色ID查询权限列表
     */
    List<SysPermission> selectByRoleId(@Param("roleId") Long roleId);

    /**
     * 根据用户ID查询权限列表（通过角色）
     */
    List<SysPermission> selectByUserId(@Param("userId") Long userId);

    /**
     * 插入权限
     */
    int insert(SysPermission permission);

    /**
     * 更新权限
     */
    int update(SysPermission permission);

    /**
     * 软删除权限
     */
    int deleteById(@Param("id") Long id);

    /**
     * 批量软删除权限
     */
    int batchDelete(@Param("ids") List<Long> ids);

    /**
     * 根据ID查询
     */
    SysPermission selectById(@Param("id") Long id);

    /**
     * 查询所有菜单
     */
    List<SysPermission> selectAllMenus();

    /**
     * 更新菜单
     */
    int updateMenu(SysPermission permission);
}