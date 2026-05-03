package com.ims.sales.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 客户保存请求
 */
@Data
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
}