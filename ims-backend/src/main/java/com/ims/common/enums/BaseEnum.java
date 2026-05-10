package com.ims.common.enums;

/**
 * 基础枚举接口
 */
public interface BaseEnum<T> {
    T getCode();
    String getDesc();

    static <E extends BaseEnum<T>, T> E of(Class<E> enumClass, T code) {
        for (E e : enumClass.getEnumConstants()) {
            if (e.getCode().equals(code)) {
                return e;
            }
        }
        return null;
    }

    static <E extends BaseEnum<T>, T> E ofOrDefault(Class<E> enumClass, T code, E defaultEnum) {
        E result = of(enumClass, code);
        return result != null ? result : defaultEnum;
    }
}