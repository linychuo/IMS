package com.ims.system.config;

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

/**
 * 数据权限 MyBatis 拦截器
 * 自动为所有 SELECT 查询添加数据权限过滤条件
 */
@Component
@Intercepts({
    @Signature(type = StatementHandler.class, method = "prepare", args = {Connection.class, Integer.class})
})
public class DataPermissionInterceptor implements Interceptor {

    private com.ims.system.service.DataPermissionService dataPermissionService;

    public DataPermissionInterceptor(com.ims.system.service.DataPermissionService dataPermissionService) {
        this.dataPermissionService = dataPermissionService;
    }

    private static final String WAREHOUSE_FILTER_SQL = " AND warehouse_id IN (%s) ";

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        StatementHandler statementHandler = (StatementHandler) SystemMetaObject.forObject(invocation.getTarget())
                .getValue("delegate.h.target");
        MetaObject metaObject = SystemMetaObject.forObject(statementHandler);

        MappedStatement ms = (MappedStatement) metaObject.getValue("mappedStatement");
        if (ms.getSqlCommandType() != SqlCommandType.SELECT) {
            return invocation.proceed();
        }

        BoundSql boundSql = statementHandler.getBoundSql();
        String originalSql = boundSql.getSql();

        if (!requiresDataPermission(ms.getId())) {
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
        String filteredSql = addWhereCondition(originalSql, String.format(WAREHOUSE_FILTER_SQL, warehouseIds));

        metaObject.setValue("delegate.boundSql.sql", filteredSql);

        return invocation.proceed();
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

    private boolean requiresDataPermission(String mapperId) {
        return mapperId.contains("inventory.") ||
               mapperId.contains("sales.") ||
               mapperId.contains("purchase.") ||
               mapperId.contains("warehouse.");
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