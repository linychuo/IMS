package com.ims.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ims.system.entity.SysConfig;
import com.ims.system.mapper.SysConfigMapper;
import com.ims.system.service.SysConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 系统配置服务实现
 */
@Service
public class SysConfigServiceImpl implements SysConfigService {

    @Autowired
    private SysConfigMapper sysConfigMapper;

    @Override
    public List<SysConfig> listAll() {
        LambdaQueryWrapper<SysConfig> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(SysConfig::getSortOrder);
        return sysConfigMapper.selectList(wrapper);
    }

    @Override
    public SysConfig getById(Long id) {
        return sysConfigMapper.selectById(id);
    }

    @Override
    public String getValue(String key) {
        return getValue(key, null);
    }

    @Override
    public String getValue(String key, String defaultValue) {
        LambdaQueryWrapper<SysConfig> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysConfig::getConfigKey, key)
                .eq(SysConfig::getStatus, 1);
        SysConfig config = sysConfigMapper.selectOne(wrapper);
        return config != null ? config.getConfigValue() : defaultValue;
    }

    @Override
    @Transactional
    public boolean create(SysConfig config) {
        config.setCreateTime(LocalDateTime.now());
        config.setStatus(1);
        return sysConfigMapper.insert(config) > 0;
    }

    @Override
    @Transactional
    public boolean update(SysConfig config) {
        config.setUpdateTime(LocalDateTime.now());
        return sysConfigMapper.updateById(config) > 0;
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        return sysConfigMapper.deleteById(id) > 0;
    }

    @Override
    public List<SysConfig> listByType(String configType) {
        LambdaQueryWrapper<SysConfig> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SysConfig::getConfigType, configType)
                .eq(SysConfig::getStatus, 1)
                .orderByAsc(SysConfig::getSortOrder);
        return sysConfigMapper.selectList(wrapper);
    }
}