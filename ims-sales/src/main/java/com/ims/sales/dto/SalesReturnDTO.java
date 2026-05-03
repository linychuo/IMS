package com.ims.sales.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 销售退货单DTO
 */
@Data
public class SalesReturnDTO {

    /**
     * ID
     */
    private String id;

    /**
     * 退货单编号
     */
    private String returnNo;

    /**
     * 关联销售订单ID
     */
    private String orderId;

    /**
     * 关联销售订单号
     */
    private String orderNo;

    /**
     * 关联销售出库单ID
     */
    private String outId;

    /**
     * 关联销售出库单号
     */
    private String outNo;

    /**
     * 客户ID
     */
    private String customerId;

    /**
     * 客户名称
     */
    private String customerName;

    /**
     * 退货日期
     */
    private LocalDate returnDate;

    /**
     * 仓库ID
     */
    private String warehouseId;

    /**
     * 仓库名称
     */
    private String warehouseName;

    /**
     * 退货人ID
     */
    private String returnBy;

    /**
     * 退货人姓名
     */
    private String returnByName;

    /**
     * 状态: 0-待审核/1-已审核/2-已入库/9-已拒绝
     */
    private Integer status;

    /**
     * 退货总金额
     */
    private BigDecimal totalAmount;

    /**
     * 退款金额
     */
    private BigDecimal refundAmount;

    /**
     * 退货原因
     */
    private String reason;

    /**
     * 备注
     */
    private String remark;

    /**
     * 审核人
     */
    private String auditedBy;

    /**
     * 审核时间
     */
    private LocalDateTime auditedAt;

    /**
     * 创建时间
     */
    private String createdAt;

    /**
     * 更新时间
     */
    private String updatedAt;

    /**
     * 退货明细列表
     */
    private List<SalesReturnDetailDTO> details;
}