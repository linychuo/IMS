package com.ims.inventory.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 入库单实体
 */
@TableName("inventory_in")
public class InventoryIn extends BaseEntity {

    private String inNo;
    private Integer inType;
    private Long warehouseId;
    private Long sourceId;
    private String sourceType;
    private BigDecimal totalAmount;
    private Integer status;
    private LocalDateTime inDate;
    private Long auditorId;
    private LocalDateTime auditTime;
    private String remark;
    private String warehouseName;

    public String getInNo() { return inNo; }
    public void setInNo(String inNo) { this.inNo = inNo; }
    public Integer getInType() { return inType; }
    public void setInType(Integer inType) { this.inType = inType; }
    public Long getWarehouseId() { return warehouseId; }
    public void setWarehouseId(Long warehouseId) { this.warehouseId = warehouseId; }
    public Long getSourceId() { return sourceId; }
    public void setSourceId(Long sourceId) { this.sourceId = sourceId; }
    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public LocalDateTime getInDate() { return inDate; }
    public void setInDate(LocalDateTime inDate) { this.inDate = inDate; }
    public Long getAuditorId() { return auditorId; }
    public void setAuditorId(Long auditorId) { this.auditorId = auditorId; }
    public LocalDateTime getAuditTime() { return auditTime; }
    public void setAuditTime(LocalDateTime auditTime) { this.auditTime = auditTime; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public String getWarehouseName() { return warehouseName; }
    public void setWarehouseName(String warehouseName) { this.warehouseName = warehouseName; }
}
