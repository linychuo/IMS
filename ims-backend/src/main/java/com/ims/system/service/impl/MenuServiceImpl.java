package com.ims.system.service.impl;

import com.ims.system.dto.MenuDTO;
import com.ims.system.dto.MenuTree;
import com.ims.system.entity.SysPermission;
import com.ims.system.mapper.SysPermissionMapper;
import com.ims.system.service.MenuService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 菜单服务实现
 */
@Service
public class MenuServiceImpl implements MenuService {

    private final SysPermissionMapper permissionMapper;

    public MenuServiceImpl(SysPermissionMapper permissionMapper) {
        this.permissionMapper = permissionMapper;
    }

    @Override
    public List<SysPermission> listAllMenus() {
        return permissionMapper.selectAllMenus();
    }

    @Override
    public List<MenuTree> getMenuTree() {
        List<SysPermission> allMenus = permissionMapper.selectAllMenus();
        // 获取顶级菜单(parentId == null)
        List<SysPermission> topMenus = allMenus.stream()
                .filter(p -> p.getParentId() == null)
                .collect(Collectors.toList());

        List<MenuTree> tree = new ArrayList<>();
        for (SysPermission menu : topMenus) {
            MenuTree node = convertToMenuTree(menu);
            List<MenuTree> children = buildChildren(menu.getId(), allMenus);
            if (!children.isEmpty()) {
                node.setChildren(children);
            }
            tree.add(node);
        }
        return tree;
    }

    private List<MenuTree> buildChildren(Long parentId, List<SysPermission> allMenus) {
        List<MenuTree> children = new ArrayList<>();
        for (SysPermission menu : allMenus) {
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

    private MenuTree convertToMenuTree(SysPermission permission) {
        MenuTree tree = new MenuTree();
        tree.setId(permission.getId());
        tree.setName(permission.getPermissionName());
        tree.setPath(permission.getPath());
        tree.setPermissionCode(permission.getPermissionCode());
        return tree;
    }

    @Override
    public SysPermission getMenuById(Long id) {
        return permissionMapper.selectById(id);
    }

    @Override
    public void createMenu(MenuDTO dto) {
        SysPermission permission = new SysPermission();
        permission.setPermissionCode(dto.getPermissionCode());
        permission.setPermissionName(dto.getPermissionName());
        permission.setParentId(dto.getParentId());
        permission.setPath(dto.getPath());
        permission.setComponent(dto.getComponent());
        permission.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : 0);
        permission.setDescription(dto.getDescription());
        permission.setStatus(dto.getStatus() != null ? dto.getStatus() : 1);
        permission.setSource("MANUAL");
        permission.setDeleted(0);
        permissionMapper.insert(permission);
    }

    @Override
    public void updateMenu(MenuDTO dto) {
        if (dto.getId() == null) {
            throw new IllegalArgumentException("Menu id cannot be null");
        }
        SysPermission permission = new SysPermission();
        permission.setId(dto.getId());
        permission.setPermissionName(dto.getPermissionName());
        permission.setParentId(dto.getParentId());
        permission.setPath(dto.getPath());
        permission.setComponent(dto.getComponent());
        permission.setSortOrder(dto.getSortOrder());
        permission.setDescription(dto.getDescription());
        permission.setStatus(dto.getStatus());
        permission.setSource("MANUAL");
        permissionMapper.updateMenu(permission);
    }

    @Override
    public void deleteMenu(Long id) {
        permissionMapper.deleteById(id);
    }

    @Override
    public void updateMenuStatus(Long id, Integer status) {
        SysPermission permission = new SysPermission();
        permission.setId(id);
        permission.setStatus(status);
        permission.setSource("MANUAL");
        permissionMapper.updateMenu(permission);
    }
}