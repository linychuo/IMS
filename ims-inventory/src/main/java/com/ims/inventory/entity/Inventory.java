package com.ims.inventory.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 库存台账实体
 */
@Data
@TableName("inventory")
public class Inventory extends BaseEntity {
    
    private Long productId;           // 商品ID
    private Long warehouseId;         // 仓库ID
    private Long locationId;           // 库位ID
    private BigDecimal quantity;       // 库存数量
    private BigDecimal frozenQuantity;// 冻结数量
    private BigDecimal cost;          // 成本单价
    private String batchNo;           // 批次号
    private LocalDate productionDate;  // 生产日期
    private LocalDate expiryDate;      // 有效期
    
    // 临时字段，不存储
    private String productName;
    private String productCode;
    private String warehouseName;
    private String locationName;
}