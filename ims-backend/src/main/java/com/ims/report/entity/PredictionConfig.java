package com.ims.report.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 预测配置实体
 */
@TableName("prediction_config")
public class PredictionConfig implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 配置类型: SALES_FORECAST-销售预测, PURCHASE_SUGGEST-采购建议, INVENTORY_ALERT-库存预警
     */
    @TableField("config_type")
    private String configType;

    /**
     * 预测算法: MOVING_AVG-移动平均, EXPONENTIAL-指数平滑
     */
    private String algorithm;

    /**
     * 预测天数
     */
    @TableField("forecast_days")
    private Integer forecastDays;

    /**
     * 历史数据天数
     */
    @TableField("history_days")
    private Integer historyDays;

    /**
     * 安全库存天数
     */
    @TableField("safety_stock_days")
    private Integer safetyStockDays;

    /**
     * 状态: 1-启用, 0-禁用
     */
    private Integer status;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getConfigType() { return configType; }
    public void setConfigType(String configType) { this.configType = configType; }
    public String getAlgorithm() { return algorithm; }
    public void setAlgorithm(String algorithm) { this.algorithm = algorithm; }
    public Integer getForecastDays() { return forecastDays; }
    public void setForecastDays(Integer forecastDays) { this.forecastDays = forecastDays; }
    public Integer getHistoryDays() { return historyDays; }
    public void setHistoryDays(Integer historyDays) { this.historyDays = historyDays; }
    public Integer getSafetyStockDays() { return safetyStockDays; }
    public void setSafetyStockDays(Integer safetyStockDays) { this.safetyStockDays = safetyStockDays; }
    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
    public LocalDateTime getUpdateTime() { return updateTime; }
    public void setUpdateTime(LocalDateTime updateTime) { this.updateTime = updateTime; }
}
