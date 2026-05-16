package com.ims.system.runner;

import com.ims.system.annotation.Permission;
import com.ims.system.entity.SysPermission;
import com.ims.system.mapper.SysPermissionMapper;
import com.ims.system.mapper.SysRolePermissionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.lang.reflect.Method;
import java.util.*;

/**
 * 权限扫描器
 * 应用启动时扫描所有 Controller 的 @Permission 注解，同步权限数据
 */
//@Component
public class PermissionScanner implements ApplicationListener<ContextRefreshedEvent> {

    private static final Logger log = LoggerFactory.getLogger(PermissionScanner.class);

    private final RequestMappingHandlerMapping handlerMapping;
    private final SysPermissionMapper permissionMapper;
    private final SysRolePermissionMapper rolePermissionMapper;

    // 缓存类级别的 @Permission 信息
    private final Map<Class<?>, ClassPermissionInfo> classPermissionCache = new HashMap<>();

    // 扫描过程中正在构建的权限缓存，用于在插入数据库前解析父子关系
    private final Map<String, Long> pendingPermissionIds = new HashMap<>();

    public PermissionScanner(
            RequestMappingHandlerMapping handlerMapping,
            SysPermissionMapper permissionMapper,
            SysRolePermissionMapper rolePermissionMapper) {
        this.handlerMapping = handlerMapping;
        this.permissionMapper = permissionMapper;
        this.rolePermissionMapper = rolePermissionMapper;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (event.getApplicationContext().getParent() != null) {
            return;
        }
        scanAndSyncPermissions();
    }

    private void scanAndSyncPermissions() {
        log.info("========== 开始扫描权限 ==========");

        // 1. 扫描所有类上的 @Permission
        scanClassPermissions();

        // 2. 扫描所有方法上的 @Permission
        List<SysPermission> buttonPermissions = new ArrayList<>();
        List<SysPermission> menuPermissions = new ArrayList<>();
        Map<RequestMappingInfo, HandlerMethod> handlerMethods = handlerMapping.getHandlerMethods();

        for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : handlerMethods.entrySet()) {
            HandlerMethod handlerMethod = entry.getValue();
            Class<?> controllerClass = handlerMethod.getBeanType();
            Method method = handlerMethod.getMethod();

            ClassPermissionInfo classInfo = classPermissionCache.get(controllerClass);
            if (classInfo == null) {
                continue;
            }

            // 类上的 @Permission 创建一级菜单
            menuPermissions.add(buildMenuPermission(classInfo, menuPermissions));

            // 方法上的 @Permission 是按钮权限
            Permission methodPerm = AnnotationUtils.findAnnotation(method, Permission.class);
            if (methodPerm != null && !methodPerm.code().isEmpty()) {
                buttonPermissions.add(buildButtonPermission(methodPerm, classInfo));
                // 创建中间级菜单（如 finance:in）
                buildChildMenus(classInfo, methodPerm.code(), menuPermissions);
            }
        }

        // 去重
        Map<String, SysPermission> uniqueButtons = new LinkedHashMap<>();
        for (SysPermission p : buttonPermissions) {
            uniqueButtons.putIfAbsent(p.getPermissionCode(), p);
        }
        buttonPermissions.clear();
        buttonPermissions.addAll(uniqueButtons.values());

        Map<String, SysPermission> uniqueMenus = new LinkedHashMap<>();
        for (SysPermission p : menuPermissions) {
            uniqueMenus.putIfAbsent(p.getPermissionCode(), p);
        }
        menuPermissions.clear();
        menuPermissions.addAll(uniqueMenus.values());

        log.info("扫描到 {} 个按钮权限，{} 个菜单权限", buttonPermissions.size(), menuPermissions.size());

        // 3. 读取数据库现有权限（包括已删除的，用于检测冲突）
        List<SysPermission> existingPermissions = permissionMapper.selectAllIncludingDeleted();
        log.info("数据库已有 {} 个权限点", existingPermissions.size());

        // 4. 构建待插入菜单的ID映射（用于解析父子关系）
        // 对于数据库已存在的菜单，使用其现有ID；对于新菜单，先临时用负数占位
        Map<String, Long> codeToIdMap = new HashMap<>();
        Map<String, SysPermission> codeToMenuMap = new LinkedHashMap<>();
        int tempId = -1;

        // 首先将数据库中已存在的一级菜单（没有冒号的）加入映射（作为父级）
        for (SysPermission existing : existingPermissions) {
            if (existing.getParentId() == null && !existing.getPermissionCode().contains(":")) {
                codeToIdMap.put(existing.getPermissionCode(), existing.getId());
            }
        }

        for (SysPermission menu : menuPermissions) {
            SysPermission existing = findByCode(existingPermissions, menu.getPermissionCode());
            if (existing != null) {
                codeToIdMap.put(menu.getPermissionCode(), existing.getId());
                // 保留现有的 parentId
                if (existing.getParentId() != null) {
                    menu.setParentId(existing.getParentId());
                }
            } else {
                codeToIdMap.put(menu.getPermissionCode(), (long) tempId--);
            }
            codeToMenuMap.put(menu.getPermissionCode(), menu);
        }

        // 解析所有菜单的父子关系（基于 code 前缀）
        resolveMenuParentIds(codeToIdMap, codeToMenuMap);

        // 5. 先同步所有菜单权限（插入数据库获取真实ID）
        for (SysPermission menu : menuPermissions) {
            SysPermission existing = findByCode(existingPermissions, menu.getPermissionCode());
            if (existing == null) {
                permissionMapper.insert(menu);
                codeToIdMap.put(menu.getPermissionCode(), menu.getId());
            } else {
                // Update existing menu, preserving parent_id if already set
                if (existing.getParentId() == null && menu.getParentId() != null) {
                    menu.setId(existing.getId());
                    permissionMapper.update(menu);
                } else if (existing.getParentId() != null && menu.getParentId() == null) {
                    // Keep existing parent_id
                    menu.setId(existing.getId());
                    menu.setParentId(existing.getParentId());
                    permissionMapper.update(menu);
                } else {
                    menu.setId(existing.getId());
                    permissionMapper.update(menu);
                }
            }
        }

        // 第二阶段：再次解析父子关系（此时codeToIdMap已包含本次插入的菜单ID）
        resolveMenuParentIds(codeToIdMap, codeToMenuMap);

        // 6. 重新更新所有需要更新parentId的菜单
        for (SysPermission menu : menuPermissions) {
            String menuCode = menu.getPermissionCode();
            Long menuId = menu.getId();
            Long currentParentId = menu.getParentId();
            // 从 codeToIdMap 中查找当前应该有的 parentId
            String parentCode = extractParentCode(menuCode);
            Long expectedParentId = parentCode != null ? codeToIdMap.get(parentCode) : null;

            // 如果当前parentId和预期不符，需要更新
            if (menuId != null && menuId > 0 && !java.util.Objects.equals(currentParentId, expectedParentId)) {
                SysPermission existing = findByCode(existingPermissions, menuCode);
                if (existing != null) {
                    menu.setParentId(expectedParentId);
                    permissionMapper.update(menu);
                }
            }
        }

        // 7. 再同步按钮权限（使用已解析的父子关系）
        for (SysPermission permission : buttonPermissions) {
            // 从已构建的菜单映射中解析 parentId
            String parentCode = extractParentCode(permission.getPermissionCode());
            if (parentCode != null && codeToIdMap.containsKey(parentCode)) {
                permission.setParentId(codeToIdMap.get(parentCode));
            }
            SysPermission existing = findByCode(existingPermissions, permission.getPermissionCode());
            if (existing == null) {
                permissionMapper.insert(permission);
            } else {
                permission.setId(existing.getId());
                permissionMapper.update(permission);
            }
        }

        // 8. 清理失效的权限
        Set<String> allCodes = new HashSet<>();
        for (SysPermission p : buttonPermissions) {
            allCodes.add(p.getPermissionCode());
        }
        for (SysPermission p : menuPermissions) {
            allCodes.add(p.getPermissionCode());
        }

        List<Long> idsToDelete = new ArrayList<>();
        for (SysPermission existing : existingPermissions) {
            if (!allCodes.contains(existing.getPermissionCode())) {
                idsToDelete.add(existing.getId());
            }
        }

        if (!idsToDelete.isEmpty()) {
            log.info("发现 {} 个失效的权限点，将被标记为删除", idsToDelete.size());
            for (Long id : idsToDelete) {
                rolePermissionMapper.deleteByPermissionId(id);
            }
            permissionMapper.batchDelete(idsToDelete);
        }

        log.info("========== 权限同步完成 ==========");
    }

    /**
     * 解析菜单的父子关系。
     * 例如 system:user 的父级是 system，system:user:add 的父级是 system:user。
     */
    private void resolveMenuParentIds(Map<String, Long> codeToIdMap, Map<String, SysPermission> codeToMenuMap) {
        for (Map.Entry<String, SysPermission> entry : codeToMenuMap.entrySet()) {
            String code = entry.getKey();
            SysPermission menu = entry.getValue();
            String parentCode = extractParentCode(code);
            if (parentCode != null && codeToIdMap.containsKey(parentCode)) {
                menu.setParentId(codeToIdMap.get(parentCode));
            }
        }
    }

    /**
     * 从权限码提取父级码。
     * 例如 "system:user:add" -> "system:user", "system:user" -> "system", "system" -> null
     */
    private String extractParentCode(String code) {
        int lastColon = code.lastIndexOf(':');
        if (lastColon > 0) {
            return code.substring(0, lastColon);
        }
        return null;
    }

    private void scanClassPermissions() {
        Map<RequestMappingInfo, HandlerMethod> handlerMethods = handlerMapping.getHandlerMethods();

        for (Map.Entry<RequestMappingInfo, HandlerMethod> entry : handlerMethods.entrySet()) {
            HandlerMethod handlerMethod = entry.getValue();
            Class<?> controllerClass = handlerMethod.getBeanType();

            if (classPermissionCache.containsKey(controllerClass)) {
                continue;
            }

            Permission classPermission = AnnotationUtils.findAnnotation(controllerClass, Permission.class);
            if (classPermission == null || classPermission.code().isEmpty()) {
                continue;
            }

            ClassPermissionInfo info = new ClassPermissionInfo();
            info.code = classPermission.code(); // 如 "system:user"
            info.name = classPermission.name();
            info.isMenu = true; // 所有类上的 @Permission 都视为菜单

            classPermissionCache.put(controllerClass, info);
        }
    }

    private SysPermission buildButtonPermission(Permission methodPerm, ClassPermissionInfo classInfo) {
        // 完整权限码 = 类code + ":" + 方法code，如 "system:user" + "read" = "system:user:read"
        String fullCode = classInfo.code + ":" + methodPerm.code();

        SysPermission permission = new SysPermission();
        permission.setPermissionCode(fullCode);
        permission.setPermissionName(methodPerm.name());
        permission.setStatus(1);
        permission.setDeleted(0);
        permission.setSortOrder(methodPerm.sortOrder());
        // parentId 稍后通过 resolveMenuParentIds 统一解析

        return permission;
    }

    private SysPermission buildMenuPermission(ClassPermissionInfo classInfo, List<SysPermission> menuPermissions) {
        // 一级菜单：从 code 提取第一段，如 "system" from "system:user"
        String topLevelCode = extractTopLevel(classInfo.code);

        SysPermission menu = new SysPermission();
        menu.setPermissionCode(topLevelCode);
        menu.setPermissionName(classInfo.name.isEmpty() ? topLevelCode : classInfo.name);
        menu.setStatus(1);
        menu.setDeleted(0);
        menu.setSortOrder(0);
        menu.setParentId(null);

        // 如果类级别的 code 包含多个段（如 "finance:payable"），也需要创建二级菜单
        if (classInfo.code.contains(":")) {
            SysPermission secondMenu = new SysPermission();
            secondMenu.setPermissionCode(classInfo.code);
            secondMenu.setPermissionName(classInfo.name.isEmpty() ? classInfo.code : classInfo.name);
            secondMenu.setStatus(1);
            secondMenu.setDeleted(0);
            secondMenu.setSortOrder(1);
            // parentId 稍后通过 resolveMenuParentIds 统一解析
            menuPermissions.add(secondMenu);
        }

        return menu;
    }

    /**
     * 为方法权限创建中间级菜单。
     * 例如 FinanceController 的方法 @Permission(code="in:read") 会创建 "finance" -> "finance:in" 这样的二级和三级菜单。
     */
    private void buildChildMenus(ClassPermissionInfo classInfo, String methodCode, List<SysPermission> menuPermissions) {
        // methodCode 可能是 "in:read" 或 "read" 等形式
        // 需要构建完整的菜单层级: "finance" -> "finance:in" -> "finance:in:read"
        String[] segments = methodCode.split(":");
        String parentCode = classInfo.code; // 如 "finance"

        for (int i = 0; i < segments.length; i++) {
            String childCode = parentCode + ":" + segments[i];
            // 检查是否已经存在同级的菜单
            boolean exists = false;
            for (SysPermission existing : menuPermissions) {
                if (existing.getPermissionCode().equals(childCode)) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                SysPermission menu = new SysPermission();
                menu.setPermissionCode(childCode);
                // 名称用最后一段或整个 methodCode
                menu.setPermissionName(i == segments.length - 1 ? methodCode : segments[i]);
                menu.setStatus(1);
                menu.setDeleted(0);
                menu.setSortOrder(i + 1);
                // parentId 稍后通过 resolveMenuParentIds 统一解析
                menuPermissions.add(menu);
            }
            parentCode = childCode;
        }
    }

    private String extractTopLevel(String code) {
        int colonIdx = code.indexOf(':');
        if (colonIdx > 0) {
            return code.substring(0, colonIdx);
        }
        return code;
    }

    private Long findParentIdByCode(String code) {
        // 如果是一级菜单本身（不包含冒号），没有父级
        if (!code.contains(":")) {
            return null;
        }
        // 否则查找该 code 对应的权限 ID 作为父级
        List<SysPermission> all = permissionMapper.selectAllIncludingDeleted();
        for (SysPermission p : all) {
            if (p.getPermissionCode().equals(code)) {
                return p.getId();
            }
        }
        return null;
    }

    private SysPermission findByCode(List<SysPermission> permissions, String code) {
        for (SysPermission p : permissions) {
            if (p.getPermissionCode().equals(code)) {
                return p;
            }
        }
        return null;
    }

    private static class ClassPermissionInfo {
        String code;      // 如 "system:user"
        String name;      // 如 "用户管理"
        boolean isMenu;   // 是否是菜单
    }
}