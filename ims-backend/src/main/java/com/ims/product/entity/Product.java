package com.ims.product.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;

import java.math.BigDecimal;

/**
 * 商品实体
 */
@TableName("product")
public class Product extends BaseEntity {

    @TableField("product_code")
    private String code;
    @TableField("product_name")
    private String name;
    @TableField("category_id")
    private String categoryId;
    private String spec;
    private String unit;
    private String barcode;
    @TableField("purchase_price")
    private BigDecimal purchasePrice;
    @TableField("sale_price")
    private BigDecimal salePrice;
    @TableField("min_sale_price")
    private BigDecimal minSalePrice;
    @TableField("min_stock")
    private Integer stockWarning;
    private Integer status;
    @TableField("image_url")
    private String imageUrl;
    private String remark;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public String getSpec() { return spec; }
    public void setSpec(String spec) { this.spec = spec; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public String getBarcode() { return barcode; }
    public void setBarcode(String barcode) { this.barcode = barcode; }
    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public void setPurchasePrice(BigDecimal purchasePrice) { this.purchasePrice = purchasePrice; }
    public BigDecimal getSalePrice() { return salePrice; }
    public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }
    public BigDecimal getMinSalePrice() { return minSalePrice; }
    public void setMinSalePrice(BigDecimal minSalePrice) { this.minSalePrice = minSalePrice; }
    public Integer getStockWarning() { return stockWarning; }
    public void setStockWarning(Integer stockWarning) { this.stockWarning = stockWarning; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}