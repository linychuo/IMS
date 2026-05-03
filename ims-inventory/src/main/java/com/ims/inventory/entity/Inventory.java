package com.ims.inventory.entity;

import com.ims.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 库存台账实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class Inventory extends BaseEntity {
    
    /**
     * 商品ID
     */
    private Long productId;
    
    /**
     * 仓库ID
     */
    private Long warehouseId;
    
    /**
     * 库存数量
     */
    private BigDecimal quantity;
    
    /**
     * 预留数量
     */
    private BigDecimal reservedQuantity;
    
    /**
     * 可用数量 = 库存数量 - 预留数量
     */
    private BigDecimal availableQuantity;
    
    /**
     * 库存批次号
     */
    private String batchNo;
    
    /**
     * 生产日期
     */
    private Date productionDate;
    
    /**
     * 过期日期
     */
    private Date expireDate;
    
    /**
     * 单价
     */
    private BigDecimal unitPrice;
    
    /**
     * 总金额
     */
    private BigDecimal totalAmount;
}