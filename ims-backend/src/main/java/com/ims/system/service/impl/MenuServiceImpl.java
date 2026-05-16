package com.ims.system.service.impl;

import com.ims.system.dto.MenuDTO;
import com.ims.system.dto.MenuTree;
import com.ims.system.entity.SysMenu;
import com.ims.system.entity.SysMenuPermission;
import com.ims.system.entity.SysPermission;
import com.ims.system.mapper.SysMenuMapper;
import com.ims.system.mapper.SysMenuPermissionMapper;
import com.ims.system.mapper.SysPermissionMapper;
import com.ims.system.service.MenuService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 栏目服务实现
 */
@Service
public class MenuServiceImpl implements MenuService {

    private final SysMenuMapper menuMapper;
    private final SysPermissionMapper permissionMapper;
    private final SysMenuPermissionMapper menuPermissionMapper;

    public MenuServiceImpl(SysMenuMapper menuMapper, SysPermissionMapper permissionMapper, SysMenuPermissionMapper menuPermissionMapper) {
        this.menuMapper = menuMapper;
        this.permissionMapper = permissionMapper;
        this.menuPermissionMapper = menuPermissionMapper;
    }

    @Override
    public List<SysMenu> listAllMenus() {
        return menuMapper.selectAll();
    }

    @Override
    public List<MenuTree> getMenuTree() {
        List<SysMenu> allMenus = menuMapper.selectAll();
        // 获取顶级栏目(parentId == null)
        List<SysMenu> topMenus = allMenus.stream()
                .filter(p -> p.getParentId() == null)
                .collect(Collectors.toList());

        List<MenuTree> tree = new ArrayList<>();
        for (SysMenu menu : topMenus) {
            MenuTree node = convertToMenuTree(menu);
            List<MenuTree> children = buildChildren(menu.getId(), allMenus);
            if (!children.isEmpty()) {
                node.setChildren(children);
            }
            tree.add(node);
        }
        return tree;
    }

    private List<MenuTree> buildChildren(Long parentId, List<SysMenu> allMenus) {
        List<MenuTree> children = new ArrayList<>();
        for (SysMenu menu : allMenus) {
            if (parentId.equals(menu.getParentId())) {
                MenuTree node = convertToMenuTree(menu);
                List<MenuTree> subChildren = buildChildren(menu.getId(), allMenus);
                if (!subChildren.isEmpty()) {
                    node.setChildren(subChildren);
                }
                children.add(node);
            }
        }
        return children;
    }

    private MenuTree convertToMenuTree(SysMenu menu) {
        MenuTree tree = new MenuTree();
        tree.setId(menu.getId());
        tree.setName(menu.getName());
        tree.setPath(menu.getPath());
        return tree;
    }

    @Override
    public SysMenu getMenuById(Long id) {
        return menuMapper.selectById(id);
    }

    @Override
    public void createMenu(MenuDTO dto) {
        SysMenu menu = new SysMenu();
        menu.setName(dto.getName());
        menu.setParentId(dto.getParentId());
        menu.setPath(dto.getPath());
        menu.setComponent(dto.getComponent());
        menu.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        menu.setDescription(dto.getDescription());
        menu.setStatus(dto.getStatus() != null ? dto.getStatus() : 1);
        menu.setDeleted(0);
        menuMapper.insert(menu);
    }

    @Override
    public void updateMenu(MenuDTO dto) {
        if (dto.getId() == null) {
            throw new IllegalArgumentException("Menu id cannot be null");
        }
        SysMenu menu = new SysMenu();
        menu.setId(dto.getId());
        menu.setName(dto.getName());
        menu.setParentId(dto.getParentId());
        menu.setPath(dto.getPath());
        menu.setComponent(dto.getComponent());
        menu.setSortOrder(dto.getSortOrder());
        menu.setDescription(dto.getDescription());
        menu.setStatus(dto.getStatus());
        menuMapper.update(menu);
    }

    @Override
    public void deleteMenu(Long id) {
        // 删除栏目前先删除权限关联
        menuPermissionMapper.deleteByMenuId(id);
        menuMapper.deleteById(id);
    }

    @Override
    public void updateMenuStatus(Long id, Integer status) {
        SysMenu menu = new SysMenu();
        menu.setId(id);
        menu.setStatus(status);
        menuMapper.update(menu);
    }

    @Override
    public List<SysPermission> getMenuPermissions(Long menuId) {
        List<Long> permissionIds = menuPermissionMapper.selectPermissionIdsByMenuId(menuId);
        if (permissionIds.isEmpty()) {
            return new ArrayList<>();
        }
        List<SysPermission> allPermissions = permissionMapper.selectAll();
        return allPermissions.stream()
                .filter(p -> permissionIds.contains(p.getId()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateMenuPermissions(Long menuId, List<Long> permissionIds) {
        menuPermissionMapper.deleteByMenuId(menuId);
        if (permissionIds != null && !permissionIds.isEmpty()) {
            List<SysMenuPermission> list = permissionIds.stream()
                    .map(permId -> {
                        SysMenuPermission mp = new SysMenuPermission();
                        mp.setMenuId(menuId);
                        mp.setPermissionId(permId);
                        return mp;
                    })
                    .collect(Collectors.toList());
            menuPermissionMapper.batchInsert(list);
        }
    }
}