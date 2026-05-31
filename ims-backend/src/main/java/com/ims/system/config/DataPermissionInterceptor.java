package com.ims.system.config;

import org.apache.ibatis.executor.statement.RoutingStatementHandler;
import org.apache.ibatis.executor.statement.StatementHandler;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.SqlCommandType;
import org.apache.ibatis.plugin.*;
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.reflection.SystemMetaObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.util.Properties;
import java.util.Set;

/**
 * 数据权限 MyBatis 拦截器
 * 自动为包含warehouse_id字段的表添加数据权限过滤条件
 */
@Component
@Intercepts({
    @Signature(type = StatementHandler.class, method = "prepare", args = {Connection.class, Integer.class})
})
public class DataPermissionInterceptor implements Interceptor {

    private com.ims.system.service.DataPermissionService dataPermissionService;

    public DataPermissionInterceptor() {
    }

    public DataPermissionInterceptor(com.ims.system.service.DataPermissionService dataPermissionService) {
        this.dataPermissionService = dataPermissionService;
    }

    // 真正需要数据权限过滤的表（这些表有warehouse_id字段）
    private static final Set<String> TABLES_WITH_WAREHOUSE = Set.of(
        "inventory",
        "inventory_in",
        "inventory_out",
        "inventory_transfer",
        "inventory_check",
        "inventory_record",
        "quality_check",
        "sales_out",
        "sales_return",
        "purchase_in",
        "purchase_return",
        "sys_user_warehouse"
    );

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        StatementHandler statementHandler = getStatementHandler(invocation);
        if (statementHandler == null) {
            return invocation.proceed();
        }

        MetaObject metaObject = SystemMetaObject.forObject(statementHandler);
        MappedStatement ms = getMappedStatement(metaObject);
        if (ms == null || ms.getSqlCommandType() != SqlCommandType.SELECT) {
            return invocation.proceed();
        }

        BoundSql boundSql = statementHandler.getBoundSql();
        String originalSql = boundSql.getSql();

        // 检查SQL是否查询包含warehouse_id的表
        if (!requiresWarehouseFilter(originalSql)) {
            return invocation.proceed();
        }

        // 检查SQL是否已经包含warehouse_id过滤，避免重复添加
        String upperSql = originalSql.toUpperCase();
        if (upperSql.contains("WAREHOUSE_ID")) {
            return invocation.proceed();
        }

        Long userId = getCurrentUserId();
        if (userId == null) {
            return invocation.proceed();
        }

        String filterCondition = dataPermissionService.getWarehouseFilterCondition(userId);
        if ("1=1".equals(filterCondition)) {
            return invocation.proceed();
        }

        String warehouseIds = filterCondition.replace("warehouse_id IN (", "").replace(")", "");
        String filteredSql = addWhereCondition(originalSql, " AND warehouse_id IN (" + warehouseIds + ")");

        metaObject.setValue("delegate.boundSql.sql", filteredSql);

        return invocation.proceed();
    }

    private StatementHandler getStatementHandler(Invocation invocation) {
        Object target = invocation.getTarget();
        if (target instanceof StatementHandler) {
            return (StatementHandler) target;
        }
        return null;
    }

    private MappedStatement getMappedStatement(MetaObject metaObject) {
        // RoutingStatementHandler has a delegate field of type PreparedStatementHandler
        Object delegate = metaObject.getValue("delegate");
        if (delegate != null) {
            MetaObject delegateMeta = SystemMetaObject.forObject(delegate);
            Object ms = delegateMeta.getValue("mappedStatement");
            if (ms instanceof MappedStatement) {
                return (MappedStatement) ms;
            }
        }
        return null;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof Long) {
            return (Long) authentication.getPrincipal();
        }
        if (authentication != null && authentication.getName() != null) {
            try {
                return Long.parseLong(authentication.getName());
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }

    /**
     * 检查SQL是否查询包含warehouse_id字段的表
     */
    private boolean requiresWarehouseFilter(String sql) {
        String upperSql = sql.toUpperCase();
        for (String table : TABLES_WITH_WAREHOUSE) {
            // 检查FROM子句中是否有这个表（简单匹配，实际生产可能需要更精确的解析）
            if (upperSql.contains("FROM " + table.toUpperCase()) ||
                upperSql.contains("JOIN " + table.toUpperCase()) ||
                upperSql.contains("LEFT JOIN " + table.toUpperCase()) ||
                upperSql.contains("RIGHT JOIN " + table.toUpperCase())) {
                return true;
            }
        }
        return false;
    }

    private String addWhereCondition(String sql, String condition) {
        String upperSql = sql.toUpperCase();
        if (upperSql.contains(" WHERE ")) {
            int whereIndex = upperSql.indexOf(" WHERE ");
            return sql.substring(0, whereIndex + 6) + condition + sql.substring(whereIndex + 6);
        } else if (upperSql.contains(" ORDER BY ")) {
            int orderIndex = upperSql.indexOf(" ORDER BY ");
            return sql.substring(0, orderIndex) + " WHERE 1=1 " + condition + sql.substring(orderIndex);
        } else {
            return sql + " WHERE 1=1 " + condition;
        }
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {
    }
}