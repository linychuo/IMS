package com.ims.procurement.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import java.time.LocalDateTime;

/**
 * 采购入库状态流转历史实体
 */
@TableName("purchase_in_status_history")
public class PurchaseInStatusHistory extends BaseEntity {

    private Long inId;
    private String inNo;
    private Integer fromStatus;
    private Integer toStatus;
    private Long operatorId;
    private String operatorName;
    private LocalDateTime operateTime;
    private String remark;

    public Long getInId() { return inId; }
    public void setInId(Long inId) { this.inId = inId; }
    public String getInNo() { return inNo; }
    public void setInNo(String inNo) { this.inNo = inNo; }
    public Integer getFromStatus() { return fromStatus; }
    public void setFromStatus(Integer fromStatus) { this.fromStatus = fromStatus; }
    public Integer getToStatus() { return toStatus; }
    public void setToStatus(Integer toStatus) { this.toStatus = toStatus; }
    public Long getOperatorId() { return operatorId; }
    public void setOperatorId(Long operatorId) { this.operatorId = operatorId; }
    public String getOperatorName() { return operatorName; }
    public void setOperatorName(String operatorName) { this.operatorName = operatorName; }
    public LocalDateTime getOperateTime() { return operateTime; }
    public void setOperateTime(LocalDateTime operateTime) { this.operateTime = operateTime; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
}