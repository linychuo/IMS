package com.ims.system.mapper;

import com.ims.system.entity.SysMenuPermission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 栏目权限Mapper
 */
@Mapper
public interface SysMenuPermissionMapper {

    /**
     * 根据栏目ID删除所有关联
     */
    int deleteByMenuId(@Param("menuId") Long menuId);

    /**
     * 批量插入栏目权限关联
     */
    int batchInsert(@Param("list") List<SysMenuPermission> list);

    /**
     * 根据栏目ID查询权限ID列表
     */
    List<Long> selectPermissionIdsByMenuId(@Param("menuId") Long menuId);
}