package com.ims.sales.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 销售订单DTO
 */
@Data
public class SalesOrderDTO {

    /**
     * ID
     */
    private String id;

    /**
     * 订单编号
     */
    private String orderNo;

    /**
     * 客户ID
     */
    private String customerId;

    /**
     * 客户名称
     */
    private String customerName;

    /**
     * 订单日期
     */
    private LocalDate orderDate;

    /**
     * 要求交货日期
     */
    private LocalDate expectedDate;

    /**
     * 状态: 0-待审核/1-已审核/2-部分出库/3-已完成/9-已取消
     */
    private Integer status;

    /**
     * 订单总金额
     */
    private BigDecimal totalAmount;

    /**
     * 优惠金额
     */
    private BigDecimal discountAmount;

    /**
     * 实际金额
     */
    private BigDecimal netAmount;

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
     * 订单明细列表
     */
    private List<SalesOrderDetailDTO> details;
}