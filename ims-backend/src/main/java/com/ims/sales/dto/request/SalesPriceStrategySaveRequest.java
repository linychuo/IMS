package com.ims.sales.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 销售价格策略保存请求
 */
public class SalesPriceStrategySaveRequest {

    /**
     * ID (更新时必填)
     */
    private String id;

    /**
     * 策略编号
     */
    @NotBlank(message = "策略编号不能为空")
    private String strategyNo;

    /**
     * 策略名称
     */
    @NotBlank(message = "策略名称不能为空")
    private String strategyName;

    /**
     * 客户ID (可选，为空表示所有客户)
     */
    private String customerId;

    /**
     * 商品ID (可选，为空表示所有商品)
     */
    private String productId;

    /**
     * 商品分类ID (可选)
     */
    private String productCategoryId;

    /**
     * 开始日期
     */
    @NotBlank(message = "开始日期不能为空")
    private LocalDate startDate;

    /**
     * 结束日期
     */
    @NotBlank(message = "结束日期不能为空")
    private LocalDate endDate;

    /**
     * 价格类型: 1-固定价/2-折扣率
     */
    @NotBlank(message = "价格类型不能为空")
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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStrategyNo() { return strategyNo; }
    public void setStrategyNo(String strategyNo) { this.strategyNo = strategyNo; }
    public String getStrategyName() { return strategyName; }
    public void setStrategyName(String strategyName) { this.strategyName = strategyName; }
    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getProductCategoryId() { return productCategoryId; }
    public void setProductCategoryId(String productCategoryId) { this.productCategoryId = productCategoryId; }
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