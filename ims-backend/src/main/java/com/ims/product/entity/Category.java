package com.ims.product.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;

/**
 * 商品分类实体
 */
@TableName("product_category")
public class Category extends BaseEntity {

    @TableField("category_code")
    private String categoryCode;

    @TableField("category_name")
    private String categoryName;

    private String parentId;
    private Integer level;
    @TableField("sort_order")
    private Integer sort;
    private Integer status;

    public String getCategoryCode() { return categoryCode; }
    public void setCategoryCode(String categoryCode) { this.categoryCode = categoryCode; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getParentId() { return parentId; }
    public void setParentId(String parentId) { this.parentId = parentId; }
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
    public Integer getSort() { return sort; }
    public void setSort(Integer sort) { this.sort = sort; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}