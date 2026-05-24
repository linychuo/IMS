package com.ims.system.service;

import com.ims.system.entity.SysConfig;
import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 系统配置服务接口
 */
public interface SysConfigService {

    /**
     * 获取所有配置
     */
    List<SysConfig> listAll();

    /**
     * 获取配置详情
     */
    SysConfig getById(Long id);

    /**
     * 根据Key获取配置值
     */
    String getValue(String key);

    /**
     * 根据Key获取配置值（带默认值）
     */
    String getValue(String key, String defaultValue);

    /**
     * 创建配置
     */
    boolean create(SysConfig config);

    /**
     * 更新配置
     */
    boolean update(SysConfig config);

    /**
     * 删除配置
     */
    boolean delete(Long id);

    /**
     * 获取指定类型的配置
     */
    List<SysConfig> listByType(String configType);

    /**
     * 分页查询
     */
    IPage<SysConfig> page(Integer page, Integer pageSize, String keyword);

    /**
     * 更新状态
     */
    boolean updateStatus(Long id, Integer status);
}