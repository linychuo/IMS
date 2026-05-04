package com.ims.supplier.dto;

import lombok.Data;

/**
 * 供应商查询请求
 */
@Data
public class SupplierQueryRequest {

    /**
     * 供应商编码
     */
    private String code;

    /**
     * 供应商名称（模糊查询）
     */
    private String name;

    /**
     * 联系人
     */
    private String contact;

    /**
     * 手机号
     */
    private String mobile;

    /**
     * 供应商等级
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