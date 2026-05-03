package com.ims.system.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 系统权限实体
 */
@Data
public class SysPermission {
    
    private Long id;
    
    private String permissionName;
    
    private String permissionCode;
    
    private String permissionType;
    
    private Long parentId;
    
    private String path;
    
    private String component;
    
    private Integer sortOrder;
    
    private String icon;
    
    private String description;
    
    private Integer status;
    
    private Long createBy;
    
    private LocalDateTime createTime;
    
    private Long updateBy;
    
    private LocalDateTime updateTime;
    
    private Integer deleted;
}