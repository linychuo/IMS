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
 * 出库单实体
 */
@Data
<<<<<<< HEAD
@EqualsAndHashCode(callSuper = true)
public class InventoryOut extends BaseEntity {
    
    /**
     * 出库单号
     */
    private String outNo;
    
    /**
     * 出库类型: 销售出库/领料出库/调拨出库/其他
     */
    private String outType;
    
    /**
     * 关联单据ID (销售订单ID/生产领料单ID等)
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
     * 客户ID (销售出库时)
     */
    private Long customerId;
    
    /**
     * 出库日期
     */
    private Date outDate;
    
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
     * 出库人ID
     */
    private Long outUserId;
    
    /**
     * 备注
     */
    private String remark;
=======
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
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}