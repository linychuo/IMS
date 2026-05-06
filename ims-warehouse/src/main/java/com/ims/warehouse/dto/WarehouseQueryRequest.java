package com.ims.warehouse.dto;

/**
 * 仓库查询请求
 */
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
}