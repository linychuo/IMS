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
@Component
public class PermissionScanner implements ApplicationListener<ContextRefreshedEvent> {

    private static final Logger log = LoggerFactory.getLogger(PermissionScanner.class);

    private final RequestMappingHandlerMapping handlerMapping;
    private final SysPermissionMapper permissionMapper;
    private final SysRolePermissionMapper rolePermissionMapper;

    // 缓存类级别的 @Permission 信息
    private final Map<Class<?>, ClassPermissionInfo> classPermissionCache = new HashMap<>();

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
            menuPermissions.add(buildMenuPermission(classInfo));

            // 方法上的 @Permission 是按钮权限
            Permission methodPerm = AnnotationUtils.findAnnotation(method, Permission.class);
            if (methodPerm != null && !methodPerm.code().isEmpty()) {
                buttonPermissions.add(buildButtonPermission(methodPerm, classInfo));
                // 创建二级菜单（如 system:user）
                menuPermissions.add(buildSecondLevelMenu(classInfo));
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

        // 4. 同步权限
        for (SysPermission permission : buttonPermissions) {
            SysPermission existing = findByCode(existingPermissions, permission.getPermissionCode());
            if (existing == null) {
                permissionMapper.insert(permission);
            } else {
                permission.setId(existing.getId());
                permissionMapper.update(permission);
            }
        }

        for (SysPermission menu : menuPermissions) {
            SysPermission existing = findByCode(existingPermissions, menu.getPermissionCode());
            if (existing == null) {
                permissionMapper.insert(menu);
            } else {
                // Only update menu if parent_id is not already set
                // This preserves manually configured parent_id values
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

        // 5. 清理失效的权限
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
        permission.setPermissionType("button");
        permission.setStatus(1);
        permission.setDeleted(0);
        permission.setSortOrder(methodPerm.sortOrder());
        permission.setParentId(findParentIdByCode(classInfo.code));

        return permission;
    }

    private SysPermission buildMenuPermission(ClassPermissionInfo classInfo) {
        // 一级菜单：从 code 提取第一段，如 "system" from "system:user"
        String topLevelCode = extractTopLevel(classInfo.code);

        SysPermission menu = new SysPermission();
        menu.setPermissionCode(topLevelCode);
        menu.setPermissionName(topLevelCode); // 用code作为名称
        menu.setPermissionType("menu");
        menu.setStatus(1);
        menu.setDeleted(0);
        menu.setSortOrder(0);
        menu.setParentId(null);

        return menu;
    }

    private SysPermission buildSecondLevelMenu(ClassPermissionInfo classInfo) {
        // 二级菜单：如 "system:user"
        String topLevelCode = extractTopLevel(classInfo.code);

        SysPermission menu = new SysPermission();
        menu.setPermissionCode(classInfo.code);
        menu.setPermissionName(classInfo.name.isEmpty() ? classInfo.code : classInfo.name);
        menu.setPermissionType("menu");
        menu.setStatus(1);
        menu.setDeleted(0);
        menu.setSortOrder(1);
        // 通过 code 前缀匹配来确定父子关系，先查询一级菜单的 ID
        Long parentId = findParentIdByCode(topLevelCode);
        menu.setParentId(parentId);

        return menu;
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