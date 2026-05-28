package com.ims.system.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 单据编号规则实体
 */
@TableName("document_no_rule")
public class DocumentNoRule implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 业务类型编码: PO-采购订单, PI-采购入库, SO-销售订单, SI-销售出库, etc.
     */
    @TableField("biz_type")
    private String bizType;

    /**
     * 业务类型名称
     */
    @TableField("biz_name")
    private String bizName;

    /**
     * 前缀
     */
    private String prefix;

    /**
     * 日期格式: yyyyMMdd, yyyyMM, yyyy 等
     */
    @TableField("date_format")
    private String dateFormat;

    /**
     * 序列号位数: 3=001, 4=0001, 5=00001
     */
    @TableField("seq_length")
    private Integer seqLength;

    /**
     * 步长
     */
    private Integer step;

    /**
     * 当前序列号
     */
    @TableField("current_seq")
    private Long currentSeq;

    /**
     * 重置频率: DAILY-每日, MONTHLY-每月, YEARLY-每年, NEVER-从不
     */
    @TableField("reset_frequency")
    private String resetFrequency;

    /**
     * 状态: 1-启用, 0-禁用
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBizType() { return bizType; }
    public void setBizType(String bizType) { this.bizType = bizType; }
    public String getBizName() { return bizName; }
    public void setBizName(String bizName) { this.bizName = bizName; }
    public String getPrefix() { return prefix; }
    public void setPrefix(String prefix) { this.prefix = prefix; }
    public String getDateFormat() { return dateFormat; }
    public void setDateFormat(String dateFormat) { this.dateFormat = dateFormat; }
    public Integer getSeqLength() { return seqLength; }
    public void setSeqLength(Integer seqLength) { this.seqLength = seqLength; }
    public Integer getStep() { return step; }
    public void setStep(Integer step) { this.step = step; }
    public Long getCurrentSeq() { return currentSeq; }
    public void setCurrentSeq(Long currentSeq) { this.currentSeq = currentSeq; }
    public String getResetFrequency() { return resetFrequency; }
    public void setResetFrequency(String resetFrequency) { this.resetFrequency = resetFrequency; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
}
