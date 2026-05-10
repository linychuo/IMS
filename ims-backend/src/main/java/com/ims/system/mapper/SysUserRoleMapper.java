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
}