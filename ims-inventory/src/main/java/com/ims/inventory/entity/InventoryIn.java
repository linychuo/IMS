package com.ims.inventory.entity;

<<<<<<< HEAD
import com.ims.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.Date;
=======
import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30

/**
 * 入库单实体
 */
@Data
<<<<<<< HEAD
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
=======
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
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}