package com.ims.sales.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 销售出库单DTO
 */
@Data
public class SalesOutDTO {

    /**
     * ID
     */
    private String id;

    /**
     * 出库单编号
     */
    private String outNo;

    /**
     * 关联销售订单ID
     */
    private String orderId;

    /**
     * 关联销售订单号
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
     * 出库日期
     */
    private LocalDate outDate;

    /**
     * 仓库ID
     */
    private String warehouseId;

    /**
     * 仓库名称
     */
    private String warehouseName;

    /**
     * 出库人ID
     */
    private String outBy;

    /**
     * 出库人姓名
     */
    private String outByName;

    /**
     * 状态: 0-待出库/1-部分出库/2-已完成/9-已取消
     */
    private Integer status;

    /**
     * 出库总金额
     */
    private BigDecimal totalAmount;

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
     * 出库明细列表
     */
    private List<SalesOutDetailDTO> details;
}