package com.ims.warehouse.dto;

import com.ims.common.dto.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 库位DTO
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class LocationDTO extends BaseDTO {

    /**
     * 库位编码
     */
    private String code;

    /**
     * 库位名称
     */
    private String name;

    /**
     * 仓库ID
     */
    private Long warehouseId;

    /**
     * 仓库名称
     */
    private String warehouseName;

    /**
     * 货架号
     */
    private String shelfNo;

    /**
     * 行
     */
    private Integer row;

    /**
     * 列
     */
    private Integer col;

    /**
     * 层
     */
    private Integer level;

    /**
     * 库位类型 (1-存储, 2-拣货, 3-暂存)
     */
    private Integer type;

    /**
     * 类型名称
     */
    private String typeName;

    /**
     * 状态 (0-启用, 1-停用, 2-冻结)
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;

    /**
     * 当前库存数量
     */
    private Integer stockQuantity;
}