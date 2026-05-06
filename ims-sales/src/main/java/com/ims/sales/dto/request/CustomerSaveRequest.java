package com.ims.sales.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * 客户保存请求
 */
public class CustomerSaveRequest {

    /**
     * ID (更新时必填)
     */
    private String id;

    /**
     * 客户编码
     */
    @NotBlank(message = "客户编码不能为空")
    private String customerCode;

    /**
     * 客户名称
     */
    @NotBlank(message = "客户名称不能为空")
    private String customerName;

    /**
     * 联系人
     */
    private String contact;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 地址
     */
    private String address;

    /**
     * 状态: 0-正常/1-停用
     */
    private Integer status = 0;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getCustomerCode() { return customerCode; }
    public void setCustomerCode(String customerCode) { this.customerCode = customerCode; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
}