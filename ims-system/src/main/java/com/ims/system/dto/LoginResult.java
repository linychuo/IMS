package com.ims.system.dto;

import lombok.Data;

/**
 * 登录结果DTO
 */
@Data
public class LoginResult {

    private String token;

    private Long userId;

    private String username;

    private String realName;

    private String avatar;
}