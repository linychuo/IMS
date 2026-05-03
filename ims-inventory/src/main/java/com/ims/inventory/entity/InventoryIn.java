package com.ims.inventory.entity;

import com.ims.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Date;

/**
 * 入库单实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class InventoryIn extends BaseEntity {
    
    /**
     * 入库单号
     */
    private String inNo;
    
    /**
     * 入库类型: 采购入库/退货入库/调拨入库/其他
     */
    private String inType;
    
    /**
     * 关联单据ID (采购订单ID/销售退货ID等)
     */
    private Long refId;
    
    /**
     * 关联单据号
     */
    private String refNo;
    
    /**
     * 仓库ID
     */
    private Long warehouseId;
    
    /**
     * 供应商ID (采购入库时)
     */
    private Long supplierId;
    
    /**
     * 入库日期
     */
    private Date inDate;
    
    /**
     * 状态: 待审核/已审核/已完成/已取消
     */
    private String status;
    
    /**
     * 审核人ID
     */
    private Long approverId;
    
    /**
     * 审核时间
     */
    private Date approveTime;
    
    /**
     * 入库人ID
     */
    private Long inUserId;
    
    /**
     * 备注
     */
    private String remark;
}