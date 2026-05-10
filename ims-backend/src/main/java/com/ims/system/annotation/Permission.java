package com.ims.system.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 权限注解
 * 类上定义模块/菜单（code如 system:user），方法上定义操作（code如 read）
 * 最终权限码 = 类code + ":" + 方法code（如 system:user:read）
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface Permission {

    /**
     * 权限编码
     * - 类上：定义模块/菜单code，如 "system:user"
     * - 方法上：定义操作code，如 "read" → 实际为 "system:user:read"
     */
    String code() default "";

    /**
     * 权限名称，如 "查看用户"
     */
    String name() default "";

    /**
     * 排序序号
     */
    int sortOrder() default 0;
}