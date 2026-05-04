package com.ims.warehouse.dto;

import com.ims.common.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 仓库DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class WarehouseDTO extends BaseDTO {

    /**
     * 仓库编码
     */
    private String code;

    /**
     * 仓库名称
     */
    private String name;

    /**
     * 仓库类型 (1-主仓, 2-分仓, 3-虚拟仓)
     */
    private Integer type;

    /**
     * 类型名称
     */
    private String typeName;

    /**
     * 地址
     */
    private String address;

    /**
     * 负责人
     */
    private String manager;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 库位数量
     */
    private Integer locationCount;

    /**
     * 状态 (0-启用, 1-停用)
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;

    /**
     * 已使用库位数量
     */
    private Integer usedLocationCount;

    /**
     * 库存商品种类数
     */
    private Integer skuCount;
}