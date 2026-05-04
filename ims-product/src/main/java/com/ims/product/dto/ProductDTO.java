package com.ims.product.dto;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.common.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 商品DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class ProductDTO extends BaseDTO {

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
     * 商品分类名称
     */
    private String categoryName;

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

    /**
     * 当前库存数量
     */
    private Integer stockQuantity;
}