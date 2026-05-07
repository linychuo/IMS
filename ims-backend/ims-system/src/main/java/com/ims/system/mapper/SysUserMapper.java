package com.ims.system.mapper;

import com.ims.system.entity.SysUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 用户Mapper接口
 */
@Mapper
public interface SysUserMapper {

    /**
     * 根据用户名查询
     */
    SysUser selectByUsername(@Param("username") String username);

    /**
     * 根据用户名和密码查询
     */
    SysUser selectByUsernameAndPassword(@Param("username") String username, @Param("password") String password);

    /**
     * 查询所有用户
     */
    List<SysUser> selectAll();

    /**
     * 根据ID查询
     */
    SysUser selectById(Long id);

    /**
     * 插入用户
     */
    int insert(SysUser user);

    /**
     * 更新用户
     */
    int update(SysUser user);

    /**
     * 删除用户
     */
    int deleteById(Long id);
}