package com.ims.system.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 系统角色实体
 */
@Data
public class SysRole {
    
    private Long id;
    
    private String roleName;
    
    private String roleCode;
    
    private String description;
    
    private Integer status;
    
    private Long createBy;
    
    private LocalDateTime createTime;
    
    private Long updateBy;
    
    private LocalDateTime updateTime;
    
    private Integer deleted;
}