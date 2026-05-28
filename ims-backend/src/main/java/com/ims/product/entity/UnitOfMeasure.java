package com.ims.product.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;

/**
 * 计量单位实体
 */
@TableName("unit_of_measure")
public class UnitOfMeasure extends BaseEntity {

    @TableField("unit_code")
    private String code;

    @TableField("unit_name")
    private String name;

    /**
     * 单位类型: 1-基本单位, 2-辅助单位
     */
    private Integer type;

    /**
     * 状态: 1-启用, 0-禁用
     */
    private Integer status;

    /**
     * 换算率（相对于基本单位的换算值）
     * 基本单位的换算率为1
     * 辅助单位的换算率 = 1个辅助单位 = 换算率个基本单位
     */
    private Double ratio;

    /**
     * 备注
     */
    private String remark;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Integer getType() { return type; }
    public void setType(Integer type) { this.type = type; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public Double getRatio() { return ratio; }
    public void setRatio(Double ratio) { this.ratio = ratio; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}
