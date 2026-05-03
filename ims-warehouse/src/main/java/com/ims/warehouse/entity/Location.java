package com.ims.warehouse.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 库位实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("ims_location")
public class Location extends BaseEntity {

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
     * 状态 (0-启用, 1-停用, 2-冻结)
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;
}