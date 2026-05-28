package com.ims.system.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 备份记录实体
 */
@TableName("backup_record")
public class BackupRecord implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 备份名称
     */
    @TableField("backup_name")
    private String backupName;

    /**
     * 备份类型: FULL-全量, INCREMENTAL-增量
     */
    @TableField("backup_type")
    private String backupType;

    /**
     * 备份文件路径
     */
    @TableField("file_path")
    private String filePath;

    /**
     * 备份文件大小(字节)
     */
    @TableField("file_size")
    private Long fileSize;

    /**
     * 备份状态: RUNNING-运行中, SUCCESS-成功, FAILED-失败
     */
    private String status;

    /**
     * 进度百分比
     */
    private Integer progress;

    /**
     * 错误信息
     */
    @TableField("error_message")
    private String errorMessage;

    /**
     * 备份开始时间
     */
    @TableField("start_time")
    private LocalDateTime startTime;

    /**
     * 备份结束时间
     */
    @TableField("end_time")
    private LocalDateTime endTime;

    /**
     * 备注
     */
    private String remark;

    @TableField("create_time")
    private LocalDateTime createTime;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBackupName() { return backupName; }
    public void setBackupName(String backupName) { this.backupName = backupName; }
    public String getBackupType() { return backupType; }
    public void setBackupType(String backupType) { this.backupType = backupType; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }
    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public String getRemark() { return remark; }
    public void setRemark(String remark) { this.remark = remark; }
    public LocalDateTime getCreateTime() { return createTime; }
    public void setCreateTime(LocalDateTime createTime) { this.createTime = createTime; }
}
