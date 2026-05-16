package com.ims.system.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户角色Mapper
 */
@Mapper
public interface SysUserRoleMapper {

    /**
     * 根据用户ID查询角色ID列表
     */
    List<Long> selectRoleIdsByUserId(@Param("userId") Long userId);

    /**
     * 插入用户角色关联
     */
    int insert(@Param("userId") Long userId, @Param("roleId") Long roleId);

    /**
     * 根据用户ID删除关联
     */
    int deleteByUserId(@Param("userId") Long userId);
}