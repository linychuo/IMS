package com.ims.finance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 收款单DTO
 */
@Data
public class FinanceInDTO {
    private Long id;
    private String inNo;              // 收款单号
    private Long orderId;             // 订单ID
    private Long customerId;         // 客户ID
    private String customerName;      // 客户名称
    private BigDecimal amount;        // 收款金额
    private BigDecimal discountAmount;// 优惠金额
    private BigDecimal actualAmount;   // 实收金额
    private Integer payMethod;        // 支付方式
    private String payMethodName;      // 支付方式名称
    private String bankAccount;       // 银行账号
    private String bankName;           // 开户行
    private LocalDateTime payDate;    // 付款日期
    private Integer status;           // 状态
    private String statusName;       // 状态名称
    private String creatorName;        // 创建人
    private String auditorName;       // 审核人
    private LocalDateTime auditTime; // 审核时间
    private LocalDateTime createTime;// 创建时间
    private String remark;           // 备注
}