package com.ims.inventory.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 入库明细实体
 */
@Data
@TableName("inventory_in_detail")
public class InventoryInDetail extends BaseEntity {
    
    private Long inId;                // 入库单ID
    private Long productId;           // 商品ID
    private Long locationId;          // 库位ID
    private BigDecimal quantity;     // 数量
    private BigDecimal price;         // 单价
    private BigDecimal amount;        // 金额
    private String batchNo;           // 批次号
    private String productionDate;   // 生产日期
    private String expiryDate;       // 有效期
    private String remark;           // 备注
    
    // 临时字段
    private String productName;
    private String productCode;
    private String locationName;
}