package com.ims.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.system.entity.SysPrintTemplate;
import com.ims.system.mapper.SysPrintTemplateMapper;
import com.ims.system.service.SysPrintTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 打印模板服务实现
 */
@Service
public class SysPrintTemplateServiceImpl implements SysPrintTemplateService {

  @Autowired
  private SysPrintTemplateMapper printTemplateMapper;

  @Override
  public List<SysPrintTemplate> list() {
    LambdaQueryWrapper<SysPrintTemplate> wrapper = new LambdaQueryWrapper<>();
    wrapper.orderByDesc(SysPrintTemplate::getId);
    return printTemplateMapper.selectList(wrapper);
  }

  @Override
  public IPage<SysPrintTemplate> page(Integer page, Integer pageSize) {
    Page<SysPrintTemplate> pageParam = new Page<>(page, pageSize);
    LambdaQueryWrapper<SysPrintTemplate> wrapper = new LambdaQueryWrapper<>();
    wrapper.orderByDesc(SysPrintTemplate::getId);
    return printTemplateMapper.selectPage(pageParam, wrapper);
  }

  @Override
  public SysPrintTemplate getById(Long id) {
    return printTemplateMapper.selectById(id);
  }

  @Override
  @Transactional
  public boolean create(SysPrintTemplate template) {
    template.setCreateTime(LocalDateTime.now());
    template.setStatus(1);
    return printTemplateMapper.insert(template) > 0;
  }

  @Override
  @Transactional
  public boolean update(SysPrintTemplate template) {
    template.setUpdateTime(LocalDateTime.now());
    return printTemplateMapper.updateById(template) > 0;
  }

  @Override
  @Transactional
  public boolean delete(Long id) {
    return printTemplateMapper.deleteById(id) > 0;
  }
}