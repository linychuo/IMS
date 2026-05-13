package com.ims.warehouse.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;

/**
 * 库位实体
 */
@TableName("inv_location")
public class Location extends BaseEntity {

    @TableField("location_code")
    private String code;

    @TableField("location_name")
    private String name;

    @TableField("warehouse_id")
    private Long warehouseId;

    @TableField("shelf_no")
    private String shelfNo;

    @TableField("row_no")
    private Integer row;

    @TableField("col_no")
    private Integer col;

    @TableField("level_no")
    private Integer level;

    @TableField("location_type")
    private Integer type;

    private Integer status;
    private String remark;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public String getShelfNo() { return shelfNo; }
    public void setShelfNo(String shelfNo) { this.shelfNo = shelfNo; }
    public Integer getRow() { return row; }
    public void setRow(Integer row) { this.row = row; }
    public Integer getCol() { return col; }
    public void setCol(Integer col) { this.col = col; }
    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }
    public Integer getType() { return type; }
    public void setType(Integer type) { this.type = type; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}