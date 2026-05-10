package com.ims.sales.entity;

import com.ims.core.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 销售价格策略实体
 */
public class SalesPriceStrategy extends BaseEntity {

    /**
     * 策略编号
     */
    private String strategyNo;

    /**
     * 策略名称
     */
    private String strategyName;

    /**
     * 客户ID
     */
    private Long customerId;

    /**
     * 客户名称
     */
    private String customerName;

    /**
     * 商品ID
     */
    private Long productId;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 商品分类ID
     */
    private Long productCategoryId;

    /**
     * 商品分类名称
     */
    private String productCategoryName;

    /**
     * 开始日期
     */
    private LocalDate startDate;

    /**
     * 结束日期
     */
    private LocalDate endDate;

    /**
     * 价格类型: 1-固定价/2-折扣率
     */
    private Integer priceType;

    /**
     * 价格
     */
    private BigDecimal price;

    /**
     * 折扣率
     */
    private BigDecimal discountRate;

    /**
     * 状态: 0-禁用/1-启用
     */
    private Integer status = 1;

    /**
     * 备注
     */
    private String remark;

    public String getStrategyNo() { return strategyNo; }
    public void setStrategyNo(String strategyNo) { this.strategyNo = strategyNo; }
    public String getStrategyName() { return strategyName; }
    public void setStrategyName(String strategyName) { this.strategyName = strategyName; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Long getProductCategoryId() { return productCategoryId; }
    public void setProductCategoryId(Long productCategoryId) { this.productCategoryId = productCategoryId; }
    public String getProductCategoryName() { return productCategoryName; }
    public void setProductCategoryName(String productCategoryName) { this.productCategoryName = productCategoryName; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public Integer getPriceType() { return priceType; }
    public void setPriceType(Integer priceType) { this.priceType = priceType; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public BigDecimal getDiscountRate() { return discountRate; }
    public void setDiscountRate(BigDecimal discountRate) { this.discountRate = discountRate; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}