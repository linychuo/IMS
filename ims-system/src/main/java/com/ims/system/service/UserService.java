package com.ims.system.service;

import com.ims.system.dto.LoginResult;
import com.ims.system.dto.UserDTO;
import com.ims.system.entity.SysUser;

import java.util.List;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 用户登录
     */
    LoginResult login(String username, String password);

    /**
     * 根据用户名查询用户
     */
    SysUser getByUsername(String username);

    /**
     * 根据ID查询用户
     */
    UserDTO getById(Long id);

    /**
     * 查询所有用户
     */
    List<UserDTO> listAll();

    /**
     * 创建用户
     */
    UserDTO create(SysUser user);

    /**
     * 更新用户
     */
    UserDTO update(SysUser user);

    /**
     * 删除用户
     */
    void delete(Long id);

    /**
     * 修改密码
     */
    void changePassword(Long userId, String oldPassword, String newPassword);

    /**
     * 重置密码
     */
    void resetPassword(Long userId, String newPassword);
}