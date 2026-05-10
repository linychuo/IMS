package com.ims.system.dto;

import java.io.Serializable;
import java.util.List;

/**
 * 登录结果DTO
 */
public class LoginResult implements Serializable {

    private String token;

    private Long userId;

    private String username;

    private String realName;

    private String avatar;

    private List<MenuTree> menus;

    private List<String> permissions;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public List<MenuTree> getMenus() {
        return menus;
    }

    public void setMenus(List<MenuTree> menus) {
        this.menus = menus;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }
}