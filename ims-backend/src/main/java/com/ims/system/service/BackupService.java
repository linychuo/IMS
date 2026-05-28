package com.ims.system.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.system.entity.BackupRecord;

/**
 * 备份恢复Service
 */
public interface BackupService extends IService<BackupRecord> {

    /**
     * 执行全量备份
     */
    BackupRecord fullBackup(String backupName);

    /**
     * 执行增量备份
     */
    BackupRecord incrementalBackup(String backupName);

    /**
     * 恢复备份
     */
    void restore(Long backupId);

    /**
     * 删除备份文件
     */
    void deleteBackup(Long backupId);
}
