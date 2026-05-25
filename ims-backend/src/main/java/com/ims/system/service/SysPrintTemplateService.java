package com.ims.system.service;

import com.ims.system.entity.SysPrintTemplate;
import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 打印模板服务接口
 */
public interface SysPrintTemplateService {

  /**
   * 列表查询
   */
  List<SysPrintTemplate> list();

  /**
   * 分页查询
   */
  IPage<SysPrintTemplate> page(Integer page, Integer pageSize);

  /**
   * 获取详情
   */
  SysPrintTemplate getById(Long id);

  /**
   * 创建模板
   */
  boolean create(SysPrintTemplate template);

  /**
   * 更新模板
   */
  boolean update(SysPrintTemplate template);

  /**
   * 删除模板
   */
  boolean delete(Long id);

  /**
   * 按类型获取默认模板
   */
  SysPrintTemplate getDefaultByType(Integer templateType);

  /**
   * 按类型获取所有模板
   */
  List<SysPrintTemplate> getByType(Integer templateType);
}