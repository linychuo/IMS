package com.ims.common.enums;

import java.util.Arrays;
import java.util.Optional;

/**
 * 枚举基础接口
 */
public interface BaseEnum<T> {

    /**
     * 获取编码
     */
    T getCode();

    /**
     * 获取描述
     */
    String getDesc();

    /**
     * 根据编码查找枚举
     */
    static <E extends BaseEnum<T>, T> E of(Class<E> enumType, T code) {
        if (code == null) {
            return null;
        }
        return Arrays.stream(enumType.getEnumConstants())
                .filter(e -> e.getCode().equals(code))
                .findFirst()
                .orElse(null);
    }

    /**
     * 根据编码查找枚举，如果不存在则返回默认值
     */
    static <E extends BaseEnum<T>, T> E ofOrDefault(Class<E> enumType, T code, E defaultValue) {
        return Optional.ofNullable(of(enumType, code)).orElse(defaultValue);
    }
}