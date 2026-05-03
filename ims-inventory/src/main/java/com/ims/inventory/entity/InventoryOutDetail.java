package com.ims.inventory.entity;

<<<<<<< HEAD
import com.ims.common.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;

/**
 * 出库单明细实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class InventoryOutDetail extends BaseEntity {
    
    /**
     * 出库单ID
     */
    private Long outId;
    
    /**
     * 商品ID
     */
    private Long productId;
    
    /**
     * 库存台账ID
     */
    private Long inventoryId;
    
    /**
     * 出库数量
     */
    private BigDecimal quantity;
    
    /**
     * 单位
     */
    private String unit;
    
    /**
     * 单价
     */
    private BigDecimal unitPrice;
    
    /**
     * 金额
     */
    private BigDecimal amount;
    
    /**
     * 备注
     */
    private String remark;
=======
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
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}