package com.ims.product.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 商品实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("ims_product")
public class Product extends BaseEntity {

    /**
     * 商品编码
     */
    private String code;

    /**
     * 商品名称
     */
    private String name;

    /**
     * 商品分类ID
     */
    private Long categoryId;

    /**
     * 规格
     */
    private String spec;

    /**
     * 单位
     */
    private String unit;

    /**
     * 条码
     */
    private String barcode;

    /**
     * 采购价
     */
    private BigDecimal purchasePrice;

    /**
     * 销售价
     */
    private BigDecimal salePrice;

    /**
     * 最低售价
     */
    private BigDecimal minSalePrice;

    /**
     * 商品状态 (0-启用, 1-停用)
     */
    private Integer status;

    /**
     * 商品图片URL
     */
    private String imageUrl;

    /**
     * 备注
     */
    private String remark;
}