package com.ims.system.service.impl;

import com.ims.system.dto.MenuTree;
import com.ims.system.entity.SysPermission;
import com.ims.system.mapper.SysPermissionMapper;
import com.ims.system.mapper.SysRolePermissionMapper;
import com.ims.system.mapper.SysUserRoleMapper;
import com.ims.system.service.PermissionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 权限服务实现
 */
@Service
public class PermissionServiceImpl implements PermissionService {

    private final SysPermissionMapper permissionMapper;
    private final SysUserRoleMapper userRoleMapper;
    private final SysRolePermissionMapper rolePermissionMapper;

    public PermissionServiceImpl(
            SysPermissionMapper permissionMapper,
            SysUserRoleMapper userRoleMapper,
            SysRolePermissionMapper rolePermissionMapper) {
        this.permissionMapper = permissionMapper;
        this.userRoleMapper = userRoleMapper;
        this.rolePermissionMapper = rolePermissionMapper;
    }

    @Override
    public List<SysPermission> getByUserId(Long userId) {
        return permissionMapper.selectByUserId(userId);
    }

    @Override
    public List<String> getPermissionCodesByUserId(Long userId) {
        List<SysPermission> permissions = getByUserId(userId);
        return permissions.stream()
                .map(SysPermission::getPermissionCode)
                .collect(Collectors.toList());
    }

    @Override
    public List<MenuTree> getMenuTreeByUserId(Long userId) {
        List<SysPermission> userPermissions = getByUserId(userId);
        List<SysPermission> allActivePermissions = permissionMapper.selectAllActive();

        // 过滤出菜单类型的权限
        List<SysPermission> menuPermissions = allActivePermissions.stream()
                .filter(p -> "menu".equals(p.getPermissionType()))
                .collect(Collectors.toList());

        // 构建菜单树
        return buildMenuTree(menuPermissions, userPermissions);
    }

    private List<MenuTree> buildMenuTree(List<SysPermission> allMenus, List<SysPermission> userPermissions) {
        List<MenuTree> result = new ArrayList<>();

        for (SysPermission menu : allMenus) {
            // 一级菜单
            if (menu.getParentId() == null) {
                MenuTree tree = new MenuTree();
                tree.setId(menu.getId());
                tree.setName(menu.getPermissionName());
                tree.setPath(menu.getPath());
                tree.setIcon(menu.getIcon());
                tree.setPermissionCode(menu.getPermissionCode());

                // 查找子菜单
                List<MenuTree> children = new ArrayList<>();
                for (SysPermission child : allMenus) {
                    if (menu.getId().equals(child.getParentId())) {
                        // 检查用户是否有该菜单或子菜单的权限
                        if (hasMenuAccess(userPermissions, child)) {
                            MenuTree childTree = new MenuTree();
                            childTree.setId(child.getId());
                            childTree.setName(child.getPermissionName());
                            childTree.setPath(child.getPath());
                            childTree.setIcon(child.getIcon());
                            childTree.setPermissionCode(child.getPermissionCode());
                            children.add(childTree);
                        }
                    }
                }

                if (!children.isEmpty() || hasMenuAccess(userPermissions, menu)) {
                    tree.setChildren(children.isEmpty() ? null : children);
                    result.add(tree);
                }
            }
        }

        return result;
    }

    private boolean hasMenuAccess(List<SysPermission> userPermissions, SysPermission menu) {
        // 检查用户是否有该菜单或任何子菜单的权限
        for (SysPermission up : userPermissions) {
            if (up.getPermissionCode().equals(menu.getPermissionCode()) ||
                up.getPermissionCode().startsWith(menu.getPermissionCode() + ":")) {
                return true;
            }
        }
        return false;
    }

    @Override
    public List<SysPermission> listAll() {
        return permissionMapper.selectAll();
    }

    @Override
    public SysPermission getByCode(String code) {
        return permissionMapper.selectByCode(code);
    }

    @Override
    @Transactional
    public void syncPermissions(List<SysPermission> permissions) {
        if (permissions == null || permissions.isEmpty()) {
            return;
        }

        List<SysPermission> existingPermissions = permissionMapper.selectAll();

        for (SysPermission permission : permissions) {
            SysPermission existing = findByCode(existingPermissions, permission.getPermissionCode());

            if (existing == null) {
                // 新增
                permissionMapper.insert(permission);
            } else {
                // 更新
                permission.setId(existing.getId());
                permissionMapper.update(permission);
            }
        }
    }

    @Override
    @Transactional
    public void removeUnusedPermissions(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return;
        }

        // 先删除角色权限关联
        for (Long id : ids) {
            rolePermissionMapper.deleteByPermissionId(id);
        }

        // 软删除权限
        permissionMapper.batchDelete(ids);
    }

    private SysPermission findByCode(List<SysPermission> permissions, String code) {
        for (SysPermission p : permissions) {
            if (p.getPermissionCode().equals(code)) {
                return p;
            }
        }
        return null;
    }
}