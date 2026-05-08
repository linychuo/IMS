package com.ims.system.controller;

import com.ims.core.result.Result;
import com.ims.system.dto.LoginRequest;
import com.ims.system.dto.LoginResult;
import com.ims.system.service.UserService;
import com.ims.system.util.JWTUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "认证管理")
public class AuthController {

    private final UserService userService;
    private final JWTUtil jwtUtil;

    public AuthController(UserService userService, JWTUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public Result<LoginResult> login(@RequestBody @Validated LoginRequest request) {
        LoginResult result = userService.login(request.getUsername(), request.getPassword());
        return Result.success(result);
    }

    /**
     * 验证Token
     */
    @GetMapping("/validate")
    @Operation(summary = "验证Token")
    public Result<String> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Result.error("无效的Token");
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            return Result.error("Token已过期");
        }
        return Result.success(jwtUtil.getUsernameFromToken(token));
    }
}