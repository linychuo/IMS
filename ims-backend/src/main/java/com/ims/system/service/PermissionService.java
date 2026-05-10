package com.ims.system.service;

import com.ims.system.dto.MenuTree;
import com.ims.system.entity.SysPermission;

import java.util.List;

/**
 * 权限服务接口
 */
public interface PermissionService {

    /**
     * 获取用户的所有权限列表
     */
    List<SysPermission> getByUserId(Long userId);

    /**
     * 获取用户的所有权限编码
     */
    List<String> getPermissionCodesByUserId(Long userId);

    /**
     * 获取用户的菜单树
     */
    List<MenuTree> getMenuTreeByUserId(Long userId);

    /**
     * 获取所有权限
     */
    List<SysPermission> listAll();

    /**
     * 根据编码获取权限
     */
    SysPermission getByCode(String code);

    /**
     * 同步权限（扫描并更新）
     */
    void syncPermissions(List<SysPermission> permissions);

    /**
     * 删除不再使用的权限
     */
    void removeUnusedPermissions(List<Long> ids);
}