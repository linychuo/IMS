package com.ims.finance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 付款单DTO
 */
@Data
public class FinanceOutDTO {
    private Long id;
    private String outNo;              // 付款单号
    private Long orderId;             // 订单ID
    private Long supplierId;          // 供应商ID
    private String supplierName;       // 供应商名称
    private BigDecimal amount;       // 付款金额
    private BigDecimal discountAmount;// 优惠金额
    private BigDecimal actualAmount;   // 实付金额
    private Integer payMethod;       // 支付方式
    private String payMethodName;   // 支付方式名称
    private String bankAccount;     // 银行账号
    private String bankName;          // 开户行
    private LocalDateTime payDate;  // 付款日期
    private Integer status;        // 状态
    private String statusName;    // 状态名称
    private String creatorName;   // 创建人
    private String auditorName;    // 审核人
    private LocalDateTime auditTime; // 审核时间
    private LocalDateTime createTime;// 创建时间
    private String remark;         // 备注
}