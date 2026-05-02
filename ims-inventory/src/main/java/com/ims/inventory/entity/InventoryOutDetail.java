package com.ims.inventory.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import java.math.BigDecimal;

/**
 * 出库明细实体
 */
@Data
@TableName("inventory_out_detail")
public class InventoryOutDetail extends BaseEntity {
    
    private Long outId;               // 出库单ID
    private Long productId;           // 商品ID
    private Long locationId;          // 库位ID
    private BigDecimal quantity;      // 数量
    private BigDecimal price;        // 单价
    private BigDecimal amount;        // 金额
    private String batchNo;            // 批次号
    private String remark;           // 备注
    
    // 临时字段
    private String productName;
    private String productCode;
    private String locationName;
}