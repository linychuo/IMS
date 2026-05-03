package com.ims.system.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 权限DTO
 */
@Data
public class PermissionDTO {

    private Long id;

    private String permissionCode;

    private String permissionName;

    private String description;

    private LocalDateTime createTime;
}