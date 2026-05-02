package com.ims.inventory.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 入库单实体
 */
@Data
@TableName("inventory_in")
public class InventoryIn extends BaseEntity {
    
    private String inNo;              // 入库单号
    private Integer inType;           // 入库类型: 1-采购入库 2-其他入库
    private Long warehouseId;         // 仓库ID
    private Long sourceId;            // 来源单据ID (采购入库单ID)
    private String sourceType;        // 来源类型: PURCHASE_IN
    private BigDecimal totalAmount;   // 总金额
    private Integer status;          // 状态: 1-待审核 2-已审核 3-已取消
    private Long auditorId;           // 审核人ID
    private LocalDateTime auditTime;  // 审核时间
    private String remark;            // 备注
    
    // 临时字段
    private String warehouseName;
}