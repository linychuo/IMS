package com.ims.warehouse.dto;

import lombok.Data;

/**
 * 仓库查询请求
 */
@Data
public class WarehouseQueryRequest {

    /**
     * 仓库编码
     */
    private String code;

    /**
     * 仓库名称（模糊查询）
     */
    private String name;

    /**
     * 仓库类型 (1-主仓, 2-分仓, 3-虚拟仓)
     */
    private Integer type;

    /**
     * 负责人
     */
    private String manager;

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