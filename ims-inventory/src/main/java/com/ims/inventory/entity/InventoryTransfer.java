package com.ims.inventory.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.ims.core.entity.BaseEntity;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 库存调拨单实体
 */
@TableName("inventory_transfer")
public class InventoryTransfer extends BaseEntity {

    /**
     * 调拨单号
     */
    private String transferNo;

    /**
     * 源仓库ID
     */
    private Long fromWarehouseId;

    /**
     * 源仓库名称
     */
    private String fromWarehouseName;

    /**
     * 目标仓库ID
     */
    private Long toWarehouseId;

    /**
     * 目标仓库名称
     */
    private String toWarehouseName;

    /**
     * 调拨日期
     */
    private LocalDate transferDate;

    /**
     * 状态: 0-待调拨 1-调拨中 2-已完成 9-已取消
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;

    /**
     * 调拨人ID
     */
    private Long transfererId;

    /**
     * 调拨人姓名
     */
    private String transfererName;

    /**
     * 调拨时间
     */
    private LocalDateTime transferTime;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 完成时间
     */
    private LocalDateTime finishTime;

    /**
     * 调拨总数量
     */
    private BigDecimal totalQuantity;

    /**
     * 调拨总金额
     */
    private BigDecimal totalAmount;

    // Getters and Setters

    public String getTransferNo() {
        return transferNo;
    }

    public void setTransferNo(String transferNo) {
        this.transferNo = transferNo;
    }

    public Long getFromWarehouseId() {
        return fromWarehouseId;
    }

    public void setFromWarehouseId(Long fromWarehouseId) {
        this.fromWarehouseId = fromWarehouseId;
    }

    public String getFromWarehouseName() {
        return fromWarehouseName;
    }

    public void setFromWarehouseName(String fromWarehouseName) {
        this.fromWarehouseName = fromWarehouseName;
    }

    public Long getToWarehouseId() {
        return toWarehouseId;
    }

    public void setToWarehouseId(Long toWarehouseId) {
        this.toWarehouseId = toWarehouseId;
    }

    public String getToWarehouseName() {
        return toWarehouseName;
    }

    public void setToWarehouseName(String toWarehouseName) {
        this.toWarehouseName = toWarehouseName;
    }

    public LocalDate getTransferDate() {
        return transferDate;
    }

    public void setTransferDate(LocalDate transferDate) {
        this.transferDate = transferDate;
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

    public Long getTransfererId() {
        return transfererId;
    }

    public void setTransfererId(Long transfererId) {
        this.transfererId = transfererId;
    }

    public String getTransfererName() {
        return transfererName;
    }

    public void setTransfererName(String transfererName) {
        this.transfererName = transfererName;
    }

    public LocalDateTime getTransferTime() {
        return transferTime;
    }

    public void setTransferTime(LocalDateTime transferTime) {
        this.transferTime = transferTime;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public LocalDateTime getFinishTime() {
        return finishTime;
    }

    public void setFinishTime(LocalDateTime finishTime) {
        this.finishTime = finishTime;
    }

    public BigDecimal getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(BigDecimal totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}