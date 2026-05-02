package com.ims.procurement.entity;

import com.ims.common.entity.BaseEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

/**
 * 采购入库明细实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PurchaseInDetail extends BaseEntity {

    /**
     * 入库单ID
     */
    @NotNull
    private String inId;

    /**
     * 订单明细ID
     */
    private String orderDetailId;

    /**
     * 商品ID
     */
    @NotNull
    private String productId;

    /**
     * 商品名称
     */
    private String productName;

    /**
     * 商品编码
     */
    private String productCode;

    /**
     * 批次号
     */
    private String batchNo;

    /**
     * 库位ID
     */
    private String locationId;

    /**
     * 库位编码
     */
    private String locationCode;

    /**
     * 单位ID
     */
    private String unitId;

    /**
     * 单位名称
     */
    private String unitName;

    /**
     * 入库数量
     */
    @NotNull
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
     * 检验状态: 0-待检验/1-合格/2-不合格
     */
    private Integer checkStatus = 0;

    /**
     * 检验数量
     */
    private BigDecimal checkedQty;

    /**
     * 备注
     */
    private String remark;
}