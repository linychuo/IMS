package com.ims.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.system.entity.BackupRecord;
import com.ims.system.mapper.BackupRecordMapper;
import com.ims.system.service.BackupService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 备份恢复Service实现
 */
@Service
public class BackupServiceImpl extends ServiceImpl<BackupRecordMapper, BackupRecord> implements BackupService {

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/ims}")
    private String dbUrl;

    @Value("${spring.datasource.username:postgres}")
    private String dbUsername;

    @Value("${spring.datasource.password:postgres}")
    private String dbPassword;

    @Value("${backup.path:/tmp/ims-backup}")
    private String backupPath;

    @Value("${backup.retention-days:30}")
    private int retentionDays;

    @Override
    @Async
    public BackupRecord fullBackup(String backupName) {
        BackupRecord record = createRecord(backupName, "FULL");

        try {
            // 创建备份目录
            File backupDir = new File(backupPath);
            if (!backupDir.exists()) {
                backupDir.mkdirs();
            }

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String fileName = "FULL_" + timestamp + ".backup";
            String filePath = backupPath + File.separator + fileName;

            record.setFilePath(filePath);
            record.setStatus("RUNNING");
            record.setProgress(0);
            record.setStartTime(LocalDateTime.now());
            save(record);

            // 执行pg_dump全量备份
            String[] command = {
                "pg_dump",
                "-h", extractHost(dbUrl),
                "-p", extractPort(dbUrl),
                "-U", dbUsername,
                "-d", extractDatabase(dbUrl),
                "-Fc",
                "-f", filePath
            };

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.environment().put("PGPASSWORD", dbPassword);

            Process process = pb.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                File backupFile = new File(filePath);
                record.setFileSize(backupFile.length());
                record.setStatus("SUCCESS");
                record.setProgress(100);
                record.setEndTime(LocalDateTime.now());
            } else {
                record.setStatus("FAILED");
                record.setErrorMessage("备份失败，退出码: " + exitCode);
                record.setEndTime(LocalDateTime.now());
            }
            updateById(record);

        } catch (Exception e) {
            record.setStatus("FAILED");
            record.setErrorMessage(e.getMessage());
            record.setEndTime(LocalDateTime.now());
            updateById(record);
        }

        return record;
    }

    @Override
    @Async
    public BackupRecord incrementalBackup(String backupName) {
        BackupRecord record = createRecord(backupName, "INCREMENTAL");

        try {
            File backupDir = new File(backupPath);
            if (!backupDir.exists()) {
                backupDir.mkdirs();
            }

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String fileName = "INCR_" + timestamp + ".dump";
            String filePath = backupPath + File.separator + fileName;

            record.setFilePath(filePath);
            record.setStatus("RUNNING");
            record.setProgress(0);
            record.setStartTime(LocalDateTime.now());
            save(record);

            // 执行pg_dump增量备份（纯SQL格式）
            String[] command = {
                "pg_dump",
                "-h", extractHost(dbUrl),
                "-p", extractPort(dbUrl),
                "-U", dbUsername,
                "-d", extractDatabase(dbUrl),
                "-Fp",
                "-f", filePath
            };

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.environment().put("PGPASSWORD", dbPassword);

            Process process = pb.start();
            int exitCode = process.waitFor();

            if (exitCode == 0) {
                File backupFile = new File(filePath);
                record.setFileSize(backupFile.length());
                record.setStatus("SUCCESS");
                record.setProgress(100);
                record.setEndTime(LocalDateTime.now());
            } else {
                record.setStatus("FAILED");
                record.setErrorMessage("备份失败，退出码: " + exitCode);
                record.setEndTime(LocalDateTime.now());
            }
            updateById(record);

        } catch (Exception e) {
            record.setStatus("FAILED");
            record.setErrorMessage(e.getMessage());
            record.setEndTime(LocalDateTime.now());
            updateById(record);
        }

        return record;
    }

    @Override
    public void restore(Long backupId) {
        BackupRecord record = getById(backupId);
        if (record == null) {
            throw new RuntimeException("备份记录不存在");
        }

        if (!"SUCCESS".equals(record.getStatus())) {
            throw new RuntimeException("只能恢复成功的备份");
        }

        if (!StringUtils.hasText(record.getFilePath())) {
            throw new RuntimeException("备份文件路径为空");
        }

        File backupFile = new File(record.getFilePath());
        if (!backupFile.exists()) {
            throw new RuntimeException("备份文件不存在: " + record.getFilePath());
        }

        try {
            // 先创建临时数据库用于验证备份文件
            String[] verifyCommand = {
                "pg_restore",
                "-h", extractHost(dbUrl),
                "-p", extractPort(dbUrl),
                "-U", dbUsername,
                "-d", extractDatabase(dbUrl),
                "--list",
                record.getFilePath()
            };

            ProcessBuilder verifyPb = new ProcessBuilder(verifyCommand);
            verifyPb.environment().put("PGPASSWORD", dbPassword);
            Process verifyProcess = verifyPb.start();
            int verifyExit = verifyProcess.waitFor();

            if (verifyExit != 0) {
                throw new RuntimeException("备份文件验证失败");
            }

            // 执行恢复
            String[] restoreCommand = {
                "pg_restore",
                "-h", extractHost(dbUrl),
                "-p", extractPort(dbUrl),
                "-U", dbUsername,
                "-d", extractDatabase(dbUrl),
                "-c",
                "--if-exists",
                record.getFilePath()
            };

            ProcessBuilder restorePb = new ProcessBuilder(restoreCommand);
            restorePb.environment().put("PGPASSWORD", dbPassword);
            Process restoreProcess = restorePb.start();
            int restoreExit = restoreProcess.waitFor();

            if (restoreExit != 0) {
                throw new RuntimeException("恢复失败，退出码: " + restoreExit);
            }

        } catch (Exception e) {
            throw new RuntimeException("恢复失败: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteBackup(Long backupId) {
        BackupRecord record = getById(backupId);
        if (record != null) {
            // 删除物理文件
            if (StringUtils.hasText(record.getFilePath())) {
                File file = new File(record.getFilePath());
                if (file.exists()) {
                    file.delete();
                }
            }
            removeById(backupId);
        }
    }

    private BackupRecord createRecord(String backupName, String backupType) {
        BackupRecord record = new BackupRecord();
        record.setBackupName(backupName);
        record.setBackupType(backupType);
        record.setStatus("PENDING");
        record.setProgress(0);
        record.setCreateTime(LocalDateTime.now());
        return record;
    }

    private String extractHost(String url) {
        // jdbc:postgresql://host:port/database
        try {
            String[] parts = url.replace("jdbc:postgresql://", "").split("/");
            return parts[0].split(":")[0];
        } catch (Exception e) {
            return "localhost";
        }
    }

    private String extractPort(String url) {
        try {
            String hostPart = url.replace("jdbc:postgresql://", "").split("/")[0];
            if (hostPart.contains(":")) {
                return hostPart.split(":")[1];
            }
        } catch (Exception e) {
            // ignore
        }
        return "5432";
    }

    private String extractDatabase(String url) {
        try {
            String[] parts = url.replace("jdbc:postgresql://", "").split("/");
            return parts[1].split("\\?")[0];
        } catch (Exception e) {
            return "ims";
        }
    }
}
