package com.ims.system.service.impl;

import com.ims.system.dto.RoleDTO;
import com.ims.system.entity.SysRole;
import com.ims.system.entity.SysRolePermission;
import com.ims.system.mapper.SysRoleMapper;
import com.ims.system.mapper.SysRolePermissionMapper;
import com.ims.system.service.RoleService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 角色服务实现
 */
@Service
public class RoleServiceImpl implements RoleService {

    private final SysRoleMapper roleMapper;
    private final SysRolePermissionMapper rolePermissionMapper;

    public RoleServiceImpl(SysRoleMapper roleMapper, SysRolePermissionMapper rolePermissionMapper) {
        this.roleMapper = roleMapper;
        this.rolePermissionMapper = rolePermissionMapper;
    }

    @Override
    public List<RoleDTO> getByUserId(Long userId) {
        List<SysRole> roles = roleMapper.selectByUserId(userId);
        return roles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RoleDTO> listAll() {
        List<SysRole> roles = roleMapper.selectAll();
        return roles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RoleDTO getById(Long id) {
        SysRole role = roleMapper.selectById(id);
        if (role == null) {
            return null;
        }
        return convertToDTO(role);
    }

    @Override
    @Transactional
    public RoleDTO create(SysRole role) {
        role.setCreateTime(LocalDateTime.now());
        role.setStatus(1);
        role.setDeleted(0);

        roleMapper.insert(role);
        return convertToDTO(role);
    }

    @Override
    @Transactional
    public RoleDTO update(SysRole role) {
        SysRole existRole = roleMapper.selectById(role.getId());
        if (existRole == null) {
            throw new RuntimeException("角色不存在");
        }

        role.setUpdateTime(LocalDateTime.now());
        roleMapper.update(role);
        return convertToDTO(roleMapper.selectById(role.getId()));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        SysRole role = roleMapper.selectById(id);
        if (role == null) {
            throw new RuntimeException("角色不存在");
        }
        roleMapper.deleteById(id);
    }

    @Override
    @Transactional
    public void assignPermissions(Long roleId, List<Long> permissionIds) {
        rolePermissionMapper.deleteByRoleId(roleId);
        if (permissionIds != null && !permissionIds.isEmpty()) {
            List<SysRolePermission> rolePermissions = permissionIds.stream()
                    .map(permissionId -> {
                        SysRolePermission rp = new SysRolePermission();
                        rp.setRoleId(roleId);
                        rp.setPermissionId(permissionId);
                        return rp;
                    })
                    .collect(Collectors.toList());
            rolePermissionMapper.batchInsert(rolePermissions);
        }
    }

    @Override
    public List<Long> getPermissionIds(Long roleId) {
        return rolePermissionMapper.selectPermissionIdsByRoleId(roleId);
    }

    private RoleDTO convertToDTO(SysRole role) {
        RoleDTO dto = new RoleDTO();
        BeanUtils.copyProperties(role, dto);
        return dto;
    }
}