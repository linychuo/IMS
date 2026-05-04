package com.ims.product.dto;

import lombok.Data;

/**
 * 商品查询请求
 */
@Data
public class ProductQueryRequest {

    /**
     * 商品编码
     */
    private String code;

    /**
     * 商品名称（模糊查询）
     */
    private String name;

    /**
     * 商品分类ID
     */
    private Long categoryId;

    /**
     * 条码
     */
    private String barcode;

    /**
     * 商品状态 (0-启用, 1-停用)
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