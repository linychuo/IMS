package com.ims.inventory.entity;

import com.ims.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 库存变动记录实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class InventoryRecord extends BaseEntity {
    
    /**
     * 库存台账ID
     */
    private Long inventoryId;
    
    /**
     * 商品ID
     */
    private Long productId;
    
    /**
     * 仓库ID
     */
    private Long warehouseId;
    
    /**
     * 变动类型: 入库/出库/调整/盘点/调拨
     */
    private String recordType;
    
    /**
     * 关联单据ID
     */
    private Long refId;
    
    /**
     * 关联单据号
     */
    private String refNo;
    
    /**
     * 变动前数量
     */
    private BigDecimal beforeQuantity;
    
    /**
     * 变动数量 (正数为入库, 负数为出库)
     */
    private BigDecimal changeQuantity;
    
    /**
     * 变动后数量
     */
    private BigDecimal afterQuantity;
    
    /**
     * 变动日期
     */
    private Date recordDate;
    
    /**
     * 操作人ID
     */
    private Long operatorId;
    
    /**
     * 备注
     */
    private String remark;
}