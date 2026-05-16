package com.ims.system.service;

import com.ims.system.dto.MenuDTO;
import com.ims.system.dto.MenuTree;
import com.ims.system.entity.SysPermission;

import java.util.List;

/**
 * 栏目服务接口
 */
public interface MenuService {

    /**
     * 获取所有栏目(平铺)
     */
    List<SysPermission> listAllMenus();

    /**
     * 获取栏目树（用于前端菜单渲染）
     */
    List<MenuTree> getMenuTree();

    /**
     * 根据ID获取栏目
     */
    SysPermission getMenuById(Long id);

    /**
     * 创建栏目
     */
    void createMenu(MenuDTO dto);

    /**
     * 更新栏目
     */
    void updateMenu(MenuDTO dto);

    /**
     * 删除栏目
     */
    void deleteMenu(Long id);

    /**
     * 更新栏目状态
     */
    void updateMenuStatus(Long id, Integer status);

    /**
     * 获取栏目的权限点列表
     */
    List<SysPermission> getMenuPermissions(Long menuId);

    /**
     * 更新栏目的权限点
     */
    void updateMenuPermissions(Long menuId, List<Long> permissionIds);
}