package com.ims.sales.dto;

import lombok.Data;

/**
 * 客户DTO
 */
@Data
public class CustomerDTO {

    /**
     * ID
     */
    private String id;

    /**
     * 客户编码
     */
    private String customerCode;

    /**
     * 客户名称
     */
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
    private Integer status;

    /**
     * 创建时间
     */
    private String createdAt;

    /**
     * 更新时间
     */
    private String updatedAt;
}