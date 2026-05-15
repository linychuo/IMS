package com.ims.system.service;

import com.ims.system.dto.MenuDTO;
import com.ims.system.dto.MenuTree;
import com.ims.system.entity.SysPermission;

import java.util.List;

/**
 * 菜单服务接口
 */
public interface MenuService {

    /**
     * 获取所有菜单(平铺)
     */
    List<SysPermission> listAllMenus();

    /**
     * 获取菜单树
     */
    List<MenuTree> getMenuTree();

    /**
     * 根据ID获取菜单
     */
    SysPermission getMenuById(Long id);

    /**
     * 创建菜单
     */
    void createMenu(MenuDTO dto);

    /**
     * 更新菜单
     */
    void updateMenu(MenuDTO dto);

    /**
     * 删除菜单
     */
    void deleteMenu(Long id);

    /**
     * 更新菜单状态
     */
    void updateMenuStatus(Long id, Integer status);
}