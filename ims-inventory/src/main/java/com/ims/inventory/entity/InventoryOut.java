package com.ims.inventory.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 出库单实体
 */
@Data
@TableName("inventory_out")
public class InventoryOut extends BaseEntity {
    
    private String outNo;             // 出库单号
    private Integer outType;         // 出库类型: 1-销售出库 2-其他出库
    private Long warehouseId;         // 仓库ID
    private Long sourceId;            // 来源单据ID (销售出库单ID)
    private String sourceType;       // 来源类型: SALES_OUT
    private BigDecimal totalAmount;  // 总金额
    private Integer status;          // 状态: 1-待审核 2-已审核 3-已取消
    private Long auditorId;          // 审核人ID
    private LocalDateTime auditTime; // 审核时间
    private String remark;           // 备注
    
    // 临时字段
    private String warehouseName;
}