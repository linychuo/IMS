package com.ims.common.enums;

/**
 * 通用状态枚举
 */
public enum CommonStatus implements BaseEnum<Integer> {

    DRAFT(0, "新建"),
    PENDING(1, "待审核"),
    APPROVED(2, "已审核"),
    REJECTED(3, "已拒绝"),
    PARTIAL(4, "部分完成"),
    COMPLETED(5, "已完成"),
    CANCELLED(9, "已取消");

    private final Integer code;
    private final String desc;

    CommonStatus(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    @Override
    public Integer getCode() {
        return code;
    }

    @Override
    public String getDesc() {
        return desc;
    }

    public static CommonStatus of(Integer code) {
        return BaseEnum.of(CommonStatus.class, code);
    }

    public static CommonStatus ofOrDefault(Integer code) {
        return BaseEnum.ofOrDefault(CommonStatus.class, code, DRAFT);
    }
}