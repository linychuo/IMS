package com.ims.system.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 角色DTO
 */
@Data
public class RoleDTO {

    private Long id;

    private String roleCode;

    private String roleName;

    private String description;

    private Integer status;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}