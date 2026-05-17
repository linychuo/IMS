package com.ims.system.service.impl;

import com.ims.system.dto.MenuTree;
import com.ims.system.entity.SysMenu;
import com.ims.system.entity.SysMenuPermission;
import com.ims.system.entity.SysPermission;
import com.ims.system.mapper.SysMenuMapper;
import com.ims.system.mapper.SysMenuPermissionMapper;
import com.ims.system.mapper.SysPermissionMapper;
import com.ims.system.mapper.SysRolePermissionMapper;
import com.ims.system.mapper.SysUserRoleMapper;
import com.ims.system.service.PermissionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 权限服务实现
 */
@Service
public class PermissionServiceImpl implements PermissionService {

    private final SysPermissionMapper permissionMapper;
    private final SysMenuMapper menuMapper;
    private final SysMenuPermissionMapper menuPermissionMapper;
    private final SysUserRoleMapper userRoleMapper;
    private final SysRolePermissionMapper rolePermissionMapper;

    public PermissionServiceImpl(
            SysPermissionMapper permissionMapper,
            SysMenuMapper menuMapper,
            SysMenuPermissionMapper menuPermissionMapper,
            SysUserRoleMapper userRoleMapper,
            SysRolePermissionMapper rolePermissionMapper) {
        this.permissionMapper = permissionMapper;
        this.menuMapper = menuMapper;
        this.menuPermissionMapper = menuPermissionMapper;
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
        // 获取用户的所有权限
        List<SysPermission> userPermissions = getByUserId(userId);
        Set<String> userPermissionCodes = userPermissions.stream()
                .map(SysPermission::getPermissionCode)
                .collect(Collectors.toSet());

        // 获取所有栏目（启用状态）
        List<SysMenu> allMenus = menuMapper.selectAllActive();

        // 获取所有栏目-权限关联
        Map<Long, List<Long>> menuPermissionMap = new HashMap<>();
        List<SysMenuPermission> allMenuPermissions = menuPermissionMapper.selectAll();
        for (SysMenuPermission mp : allMenuPermissions) {
            menuPermissionMap.computeIfAbsent(mp.getMenuId(), k -> new ArrayList<>()).add(mp.getPermissionId());
        }

        // 构建菜单树（只包含用户有权限访问的栏目）
        List<MenuTree> result = new ArrayList<>();

        // 获取顶级栏目(parentId == null)
        List<SysMenu> topMenus = allMenus.stream()
                .filter(m -> m.getParentId() == null)
                .collect(Collectors.toList());

        for (SysMenu menu : topMenus) {
            MenuTree tree = buildMenuTreeRecursive(menu, allMenus, menuPermissionMap, userPermissionCodes);
            if (tree != null) {
                result.add(tree);
            }
        }

        return result;
    }

    /**
     * 检查用户是否拥有指定权限的直接子权限，且该子权限必须在当前菜单的权限列表中
     * 只有当用户拥有的子权限同时属于当前菜单的权限链时，才授予访问权限
     */
    private boolean hasDirectChildPermission(Long parentPermId, Set<String> userPermissionCodes, List<Long> menuPermIds) {
        // 查找直接子权限
        List<SysPermission> children = permissionMapper.selectByParentId(parentPermId);
        for (SysPermission child : children) {
            // 只有当这个子权限也在当前菜单的权限列表中时，才授予访问权限
            if (menuPermIds.contains(child.getId()) && userPermissionCodes.contains(child.getPermissionCode())) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查用户是否拥有指定权限的任何后代权限
     */
    private boolean hasChildPermission(Long parentPermId, Set<String> userPermissionCodes) {
        // 查找所有后代权限
        List<SysPermission> children = permissionMapper.selectByParentId(parentPermId);
        for (SysPermission child : children) {
            if (userPermissionCodes.contains(child.getPermissionCode())) {
                return true;
            }
            // 递归检查更下层的权限
            if (hasChildPermission(child.getId(), userPermissionCodes)) {
                return true;
            }
        }
        return false;
    }

    private MenuTree buildMenuTreeRecursive(SysMenu menu, List<SysMenu> allMenus,
                                           Map<Long, List<Long>> menuPermissionMap,
                                           Set<String> userPermissionCodes) {
        // 检查用户是否有该菜单的权限
        List<Long> menuPermIds = menuPermissionMap.get(menu.getId());
        boolean hasAccess = false;
        if (menuPermIds != null) {
            for (Long permId : menuPermIds) {
                SysPermission perm = permissionMapper.selectById(permId);
                if (perm != null && userPermissionCodes.contains(perm.getPermissionCode())) {
                    hasAccess = true;
                    break;
                }
            }
        }
        // 如果精确匹配未命中，检查用户是否有该菜单权限的直接子权限（且该子权限属于当前菜单的权限链）
        if (!hasAccess && menuPermIds != null) {
            for (Long permId : menuPermIds) {
                // 检查用户是否拥有此菜单权限的直接后代权限（必须是同一权限树分支）
                if (hasDirectChildPermission(permId, userPermissionCodes, menuPermIds)) {
                    hasAccess = true;
                    break;
                }
            }
        }

        // 如果用户没有该菜单的权限，且没有子菜单有权限，返回null
        List<MenuTree> accessibleChildren = new ArrayList<>();
        for (SysMenu child : allMenus) {
            if (menu.getId().equals(child.getParentId())) {
                MenuTree childTree = buildMenuTreeRecursive(child, allMenus, menuPermissionMap, userPermissionCodes);
                if (childTree != null) {
                    accessibleChildren.add(childTree);
                }
            }
        }

        if (!hasAccess && accessibleChildren.isEmpty()) {
            return null;
        }

        MenuTree tree = new MenuTree();
        tree.setId(menu.getId());
        tree.setName(menu.getName());
        tree.setPath(menu.getPath());

        if (!accessibleChildren.isEmpty()) {
            tree.setChildren(accessibleChildren);
        }

        return tree;
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