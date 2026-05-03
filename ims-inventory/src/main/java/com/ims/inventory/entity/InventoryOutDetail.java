package com.ims.inventory.entity;

import com.ims.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

/**
 * 出库单明细实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class InventoryOutDetail extends BaseEntity {
    
    /**
     * 出库单ID
     */
    private Long outId;
    
    /**
     * 商品ID
     */
    private Long productId;
    
    /**
     * 库存台账ID
     */
    private Long inventoryId;
    
    /**
     * 出库数量
     */
    private BigDecimal quantity;
    
    /**
     * 单位
     */
    private String unit;
    
    /**
     * 单价
     */
    private BigDecimal unitPrice;
    
    /**
     * 金额
     */
    private BigDecimal amount;
    
    /**
     * 备注
     */
    private String remark;
}