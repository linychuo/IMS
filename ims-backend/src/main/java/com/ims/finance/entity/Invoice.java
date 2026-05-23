package com.ims.finance.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 发票实体
 */
@TableName("invoice")
public class Invoice extends BaseEntity {

    /**
     * 发票号码
     */
    private String invoiceNo;

    /**
     * 发票类型: 1-采购发票/2-销售发票
     */
    private Integer invoiceType;

    /**
     * 发票种类: 1-增值税专用发票/2-增值税普通发票/3-电子发票
     */
    private Integer invoiceKind;

    /**
     * 关联单据类型: PURCHASE_IN-采购入库/SALES_OUT-销售出库
     */
    private String orderType;

    /**
     * 关联单据ID
     */
    private Long orderId;

    /**
     * 关联单据号
     */
    private String orderNo;

    /**
     * 供应商ID（采购发票）
     */
    private Long supplierId;

    /**
     * 供应商名称
     */
    private String supplierName;

    /**
     * 客户ID（销售发票）
     */
    private Long customerId;

    /**
     * 客户名称
     */
    private String customerName;

    /**
     * 开票日期
     */
    private LocalDate invoiceDate;

    /**
     * 发票金额
     */
    private BigDecimal amount;

    /**
     * 税率
     */
    private BigDecimal taxRate;

    /**
     * 税额
     */
    private BigDecimal taxAmount;

    /**
     * 含税金额
     */
    private BigDecimal totalAmount;

    /**
     * 发票代码（税务系统）
     */
    private String invoiceCode;

    /**
     * 发票号码（税务系统）
     */
    private String invoiceNumber;

    /**
     * 状态: 0-未勾选/1-已勾选/2-已报销/3-已作废
     */
    private Integer status;

    /**
     * 勾选日期
     */
    private LocalDateTime checkDate;

    /**
     * 备注
     */
    private String remark;

    public String getInvoiceNo() { return invoiceNo; }
    public void setInvoiceNo(String invoiceNo) { this.invoiceNo = invoiceNo; }
    public Integer getInvoiceType() { return invoiceType; }
    public void setInvoiceType(Integer invoiceType) { this.invoiceType = invoiceType; }
    public Integer getInvoiceKind() { return invoiceKind; }
    public void setInvoiceKind(Integer invoiceKind) { this.invoiceKind = invoiceKind; }
    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNo() { return orderNo; }
    public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }
    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getTaxRate() { return taxRate; }
    public void setTaxRate(BigDecimal taxRate) { this.taxRate = taxRate; }
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getInvoiceCode() { return invoiceCode; }
    public void setInvoiceCode(String invoiceCode) { this.invoiceCode = invoiceCode; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public LocalDateTime getCheckDate() { return checkDate; }
    public void setCheckDate(LocalDateTime checkDate) { this.checkDate = checkDate; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}