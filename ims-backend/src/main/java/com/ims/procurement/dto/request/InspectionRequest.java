package com.ims.procurement.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

/**
 * 采购入库检验请求
 */
public class InspectionRequest {

    /**
     * 明细检验项
     */
    @NotEmpty(message = "检验明细不能为空")
    private List<InspectionItem> items;

    public List<InspectionItem> getItems() {
        return items;
    }

    public void setItems(List<InspectionItem> items) {
        this.items = items;
    }

    public static class InspectionItem {
        @NotNull(message = "明细ID不能为空")
        private String detailId;

        @NotNull(message = "检验状态不能为空")
        private Integer checkStatus; // 0-待检验/1-合格/2-不合格

        private BigDecimal checkedQty;

        private String remark;

        public String getDetailId() {
            return detailId;
        }

        public void setDetailId(String detailId) {
            this.detailId = detailId;
        }

        public Integer getCheckStatus() {
            return checkStatus;
        }

        public void setCheckStatus(Integer checkStatus) {
            this.checkStatus = checkStatus;
        }

        public BigDecimal getCheckedQty() {
            return checkedQty;
        }

        public void setCheckedQty(BigDecimal checkedQty) {
            this.checkedQty = checkedQty;
        }

        public String getRemark() {
            return remark;
        }

        public void setRemark(String remark) {
            this.remark = remark;
        }
    }
}