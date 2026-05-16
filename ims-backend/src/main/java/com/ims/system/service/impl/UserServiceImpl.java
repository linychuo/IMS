package com.ims.system.service.impl;

import com.ims.system.dto.LoginResult;
import com.ims.system.dto.MenuTree;
import com.ims.system.dto.UserDTO;
import com.ims.system.entity.SysUser;
import com.ims.system.mapper.SysUserMapper;
import com.ims.system.mapper.SysUserRoleMapper;
import com.ims.system.service.PermissionService;
import com.ims.system.service.UserService;
import com.ims.system.util.JWTUtil;
import com.ims.system.util.SecurityUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户服务实现
 */
@Service
public class UserServiceImpl implements UserService {

    private final SysUserMapper userMapper;
    private final SysUserRoleMapper userRoleMapper;
    private final JWTUtil jwtUtil;
    private final PermissionService permissionService;

    public UserServiceImpl(SysUserMapper userMapper, SysUserRoleMapper userRoleMapper, JWTUtil jwtUtil, PermissionService permissionService) {
        this.userMapper = userMapper;
        this.userRoleMapper = userRoleMapper;
        this.jwtUtil = jwtUtil;
        this.permissionService = permissionService;
    }

    @Override
    public LoginResult login(String username, String password) {
        // 查询用户
        SysUser user = userMapper.selectByUsername(username);
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }

        // 验证密码
        if (!SecurityUtil.matches(password, user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }

        // 检查用户状态
        if (user.getStatus() != null && user.getStatus() == 0) {
            throw new RuntimeException("账号已被禁用");
        }

        // 生成Token
        String token = jwtUtil.generateToken(user.getId(), user.getUsername());

        // 获取用户菜单和权限
        List<MenuTree> menus = permissionService.getMenuTreeByUserId(user.getId());
        List<String> permissionCodes = permissionService.getPermissionCodesByUserId(user.getId());

        // 构建返回结果
        LoginResult result = new LoginResult();
        result.setToken(token);
        result.setUserId(user.getId());
        result.setUsername(user.getUsername());
        result.setRealName(user.getRealName());
        result.setAvatar(user.getAvatar() != null ? user.getAvatar().toString() : null);
        result.setMenus(menus);
        result.setPermissions(permissionCodes);

        return result;
    }

    @Override
    public SysUser getByUsername(String username) {
        return userMapper.selectByUsername(username);
    }

    @Override
    public UserDTO getById(Long id) {
        SysUser user = userMapper.selectById(id);
        if (user == null) {
            return null;
        }
        return convertToDTO(user);
    }

    @Override
    public List<UserDTO> listAll() {
        return userMapper.selectAllWithRole();
    }

    @Override
    @Transactional
    public UserDTO create(SysUser user) {
        // 检查用户名是否存在
        SysUser existUser = userMapper.selectByUsername(user.getUsername());
        if (existUser != null) {
            throw new RuntimeException("用户名已存在");
        }

        // 加密密码
        user.setPassword(SecurityUtil.encode(user.getPassword()));
        user.setCreateTime(LocalDateTime.now());
        user.setStatus(1);
        user.setDeleted(0);

        userMapper.insert(user);
        return convertToDTO(user);
    }

    @Override
    @Transactional
    public UserDTO update(SysUser user) {
        SysUser existUser = userMapper.selectById(user.getId());
        if (existUser == null) {
            throw new RuntimeException("用户不存在");
        }

        // 如果修改了用户名，检查是否重复
        if (user.getUsername() != null && !user.getUsername().equals(existUser.getUsername())) {
            SysUser duplicate = userMapper.selectByUsername(user.getUsername());
            if (duplicate != null) {
                throw new RuntimeException("用户名已存在");
            }
        }

        // 不修改密码
        user.setPassword(null);
        user.setUpdateTime(LocalDateTime.now());

        userMapper.update(user);
        return convertToDTO(userMapper.selectById(user.getId()));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (id == 1) {
            throw new RuntimeException("不能删除管理员用户");
        }
        SysUser user = userMapper.selectById(id);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        userMapper.deleteById(id);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        SysUser user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        // 验证旧密码
        if (!SecurityUtil.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("原密码错误");
        }

        // 修改密码
        user.setPassword(SecurityUtil.encode(newPassword));
        user.setUpdateTime(LocalDateTime.now());
        userMapper.update(user);
    }

    @Override
    @Transactional
    public void resetPassword(Long userId, String newPassword) {
        SysUser user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }

        user.setPassword(SecurityUtil.encode(newPassword));
        user.setUpdateTime(LocalDateTime.now());
        userMapper.update(user);
    }

    @Override
    @Transactional
    public void assignRole(Long userId, Long roleId) {
        SysUser user = userMapper.selectById(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        // 先删除用户的所有角色关联
        userRoleMapper.deleteByUserId(userId);
        // 再插入新的角色关联
        if (roleId != null) {
            userRoleMapper.insert(userId, roleId);
        }
    }

    private UserDTO convertToDTO(SysUser user) {
        UserDTO dto = new UserDTO();
        BeanUtils.copyProperties(user, dto);
        return dto;
    }
}