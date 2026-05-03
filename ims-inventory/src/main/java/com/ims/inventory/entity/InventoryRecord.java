package com.ims.inventory.entity;

<<<<<<< HEAD
import com.ims.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.util.Date;
=======
import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30

/**
 * 库存变动记录实体
 */
@Data
<<<<<<< HEAD
@EqualsAndHashCode(callSuper = true)
public class InventoryRecord extends BaseEntity {
    
    /**
     * 库存台账ID
     */
    private Long inventoryId;
    
    /**
     * 商品ID
     */
    private Long productId;
    
    /**
     * 仓库ID
     */
    private Long warehouseId;
    
    /**
     * 变动类型: 入库/出库/调整/盘点/调拨
     */
    private String recordType;
    
    /**
     * 关联单据ID
     */
    private Long refId;
    
    /**
     * 关联单据号
     */
    private String refNo;
    
    /**
     * 变动前数量
     */
    private BigDecimal beforeQuantity;
    
    /**
     * 变动数量 (正数为入库, 负数为出库)
     */
    private BigDecimal changeQuantity;
    
    /**
     * 变动后数量
     */
    private BigDecimal afterQuantity;
    
    /**
     * 变动日期
     */
    private Date recordDate;
    
    /**
     * 操作人ID
     */
    private Long operatorId;
    
    /**
     * 备注
     */
    private String remark;
=======
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
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}