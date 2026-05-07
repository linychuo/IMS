package com.ims.finance.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 核销记录实体
 */
@TableName("writeoff_record")
public class WriteoffRecord extends BaseEntity {

    /**
     * 核销单号
     */
    private String writeoffNo;

    /**
     * 核销类型: RECEIVABLE-应收核销  PAYABLE-应付核销
     */
    private String writeoffType;

    /**
     * 来源ID (应收/应付ID)
     */
    private Long sourceId;

    /**
     * 来源单号
     */
    private String sourceNo;

    /**
     * 目标ID (收款/付款ID)
     */
    private Long targetId;

    /**
     * 目标单号
     */
    private String targetNo;

    /**
     * 核销金额
     */
    private BigDecimal amount;

    /**
     * 核销时间
     */
    private LocalDateTime writeoffTime;

    /**
     * 状态: 1-有效 0-已撤销
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;

    /**
     * 操作人ID
     */
    private Long operatorId;

    // Getters and Setters

    public String getWriteoffNo() {
        return writeoffNo;
    }

    public void setWriteoffNo(String writeoffNo) {
        this.writeoffNo = writeoffNo;
    }

    public String getWriteoffType() {
        return writeoffType;
    }

    public void setWriteoffType(String writeoffType) {
        this.writeoffType = writeoffType;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }

    public String getSourceNo() {
        return sourceNo;
    }

    public void setSourceNo(String sourceNo) {
        this.sourceNo = sourceNo;
    }

    public Long getTargetId() {
        return targetId;
    }

    public void setTargetId(Long targetId) {
        this.targetId = targetId;
    }

    public String getTargetNo() {
        return targetNo;
    }

    public void setTargetNo(String targetNo) {
        this.targetNo = targetNo;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getWriteoffTime() {
        return writeoffTime;
    }

    public void setWriteoffTime(LocalDateTime writeoffTime) {
        this.writeoffTime = writeoffTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Long getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(Long operatorId) {
        this.operatorId = operatorId;
    }
}