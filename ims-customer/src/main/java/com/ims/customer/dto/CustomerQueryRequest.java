package com.ims.customer.dto;

import lombok.Data;

/**
 * 客户查询请求
 */
@Data
public class CustomerQueryRequest {

    /**
     * 客户编码
     */
    private String code;

    /**
     * 客户名称（模糊查询）
     */
    private String name;

    /**
     * 客户类型 (1-个人, 2-企业)
     */
    private Integer type;

    /**
     * 联系人
     */
    private String contact;

    /**
     * 手机号
     */
    private String mobile;

    /**
     * 客户等级
     */
    private Integer level;

    /**
     * 状态 (0-启用, 1-停用)
     */
    private Integer status;

    /**
     * 页码
     */
    private Integer page = 1;

    /**
     * 每页数量
     */
    private Integer pageSize = 10;
}