package com.ims.purchase.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 采购入库明细实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("ims_purchase_in_item")
public class PurchaseInItem extends BaseEntity {

    /**
     * 入库单ID
     */
    private Long inId;

    /**
     * 订单明细ID
     */
    private Long orderItemId;

    /**
     * 商品ID
     */
    private Long productId;

    /**
     * 商品编码
     */
    private String productCode;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 单位
     */
    private String unit;

    /**
     * 入库数量
     */
    private BigDecimal quantity;

    /**
     * 采购单价
     */
    private BigDecimal price;

    /**
     * 金额
     */
    private BigDecimal amount;

    /**
     * 批次号
     */
    private String batchNo;

    /**
     * 生产日期
     */
    private String productionDate;

    /**
     * 库位ID
     */
    private Long locationId;

    /**
     * 备注
     */
    private String remark;
}