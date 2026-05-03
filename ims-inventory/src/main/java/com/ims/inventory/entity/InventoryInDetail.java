package com.ims.inventory.entity;

import com.ims.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

/**
 * 入库单明细实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class InventoryInDetail extends BaseEntity {
    
    /**
     * 入库单ID
     */
    private Long inId;
    
    /**
     * 商品ID
     */
    private Long productId;
    
    /**
     * 库存台账ID (如果已存在)
     */
    private Long inventoryId;
    
    /**
     * 入库数量
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
     * 库存批次号
     */
    private String batchNo;
    
    /**
     * 生产日期
     */
    private String productionDate;
    
    /**
     * 过期日期
     */
    private String expireDate;
    
    /**
     * 备注
     */
    private String remark;
}