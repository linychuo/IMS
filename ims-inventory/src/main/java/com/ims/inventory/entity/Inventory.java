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
import java.time.LocalDate;
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30

/**
 * 库存台账实体
 */
@Data
<<<<<<< HEAD
@EqualsAndHashCode(callSuper = true)
public class Inventory extends BaseEntity {
    
    /**
     * 商品ID
     */
    private Long productId;
    
    /**
     * 仓库ID
     */
    private Long warehouseId;
    
    /**
     * 库存数量
     */
    private BigDecimal quantity;
    
    /**
     * 预留数量
     */
    private BigDecimal reservedQuantity;
    
    /**
     * 可用数量 = 库存数量 - 预留数量
     */
    private BigDecimal availableQuantity;
    
    /**
     * 库存批次号
     */
    private String batchNo;
    
    /**
     * 生产日期
     */
    private Date productionDate;
    
    /**
     * 过期日期
     */
    private Date expireDate;
    
    /**
     * 单价
     */
    private BigDecimal unitPrice;
    
    /**
     * 总金额
     */
    private BigDecimal totalAmount;
=======
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
>>>>>>> 21bd09fedd2f343af76a217bcc3b0e666ca0ac30
}