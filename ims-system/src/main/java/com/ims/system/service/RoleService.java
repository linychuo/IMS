package com.ims.system.service;

import com.ims.system.dto.RoleDTO;
import com.ims.system.entity.SysRole;

import java.util.List;

/**
 * 角色服务接口
 */
public interface RoleService {

    /**
     * 根据用户ID查询角色列表
     */
    List<RoleDTO> getByUserId(Long userId);

    /**
     * 查询所有角色
     */
    List<RoleDTO> listAll();

    /**
     * 根据ID查询
     */
    RoleDTO getById(Long id);

    /**
     * 创建角色
     */
    RoleDTO create(SysRole role);

    /**
     * 更新角色
     */
    RoleDTO update(SysRole role);

    /**
     * 删除角色
     */
    void delete(Long id);

    /**
     * 分配权限
     */
    void assignPermissions(Long roleId, List<Long> permissionIds);
}