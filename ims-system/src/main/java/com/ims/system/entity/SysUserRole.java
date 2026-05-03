package com.ims.system.entity;

import lombok.Data;

/**
 * 用户角色关联实体
 */
@Data
public class SysUserRole {
    
    private Long id;
    
    private Long userId;
    
    private Long roleId;
}