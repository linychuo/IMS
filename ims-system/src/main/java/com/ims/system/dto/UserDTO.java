package com.ims.system.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户DTO
 */
@Data
public class UserDTO {

    private Long id;

    private String username;

    private String realName;

    private String email;

    private String mobile;

    private Long avatar;

    private Integer status;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}