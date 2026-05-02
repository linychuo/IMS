package com.ims.inventory.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 库存变动记录实体
 */
@Data
@TableName("inventory_record")
public class InventoryRecord extends BaseEntity {
    
    private Long productId;           // 商品ID
    private Long warehouseId;        // 仓库ID
    private Long locationId;         // 库位ID
    private String changeType;        // 变动类型: IN/OUT/ADJUST/FREEZE/UNFREEZE
    private BigDecimal changeQuantity;// 变动数量
    private BigDecimal beforeQuantity;// 变动前数量
    private BigDecimal afterQuantity;  // 变动后数量
    private String orderType;         // 来源单据类型: PURCHASE_IN, SALES_OUT, INVENTORY_IN, INVENTORY_OUT, CHECK, TRANSFER
    private Long orderId;             // 关联单据ID
    private Long orderDetailId;      // 关联明细ID
    private String batchNo;          // 批次号
    private String remark;          // 备注
    
    // 临时字段
    private String productName;
    private String warehouseName;
}