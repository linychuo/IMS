package com.ims.finance.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("finance_out")
public class FinanceOut extends BaseEntity {
    private String outNo;             // 付款单号
    private Long orderId;              // 订单ID(采购订单)
    private Long supplierId;           // 供应商ID
    private BigDecimal amount;         // 付款金额
    private BigDecimal discountAmount; // 优惠金额
    private Integer payMethod;         // 支付方式: 1-现金 2-银行转账 3-支付宝 4-微信 5-其他
    private String bankAccount;       // 银行账号
    private String bankName;           // 开户行
    private LocalDateTime payDate;     // 付款日期
    private Integer status;            // 状态: 1-待审核 2-已审核 3-已取消
    private String remark;             // 备注
    private Long creatorId;           // 创建人ID
    private Long auditorId;            // 审核人ID
    private LocalDateTime auditTime;   // 审核时间
}