package com.ims.system.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.ims.core.result.Result;
import com.ims.system.annotation.Permission;
import com.ims.system.entity.SysPrintTemplate;
import com.ims.system.service.SysPrintTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * 打印模板控制器
 */
@RestController
@RequestMapping("/print-template")
public class SysPrintTemplateController {

  @Autowired
  private SysPrintTemplateService printTemplateService;

  @Permission(code = "system:printTemplate:list", name = "打印模板列表")
  @GetMapping("/list")
  public Result<List<SysPrintTemplate>> list() {
    return Result.success(printTemplateService.list());
  }

  @Permission(code = "system:printTemplate:page", name = "打印模板分页")
  @GetMapping("/page")
  public Result<IPage<SysPrintTemplate>> page(
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "10") Integer pageSize) {
    return Result.success(printTemplateService.page(page, pageSize));
  }

  @Permission(code = "system:printTemplate:get", name = "获取打印模板")
  @GetMapping("/{id}")
  public Result<SysPrintTemplate> get(@PathVariable Long id) {
    return Result.success(printTemplateService.getById(id));
  }

  @Permission(code = "system:printTemplate:create", name = "创建打印模板")
  @PostMapping
  public Result<Boolean> create(@RequestBody SysPrintTemplate template) {
    return Result.success(printTemplateService.create(template));
  }

  @Permission(code = "system:printTemplate:update", name = "更新打印模板")
  @PutMapping("/{id}")
  public Result<Boolean> update(@PathVariable Long id, @RequestBody SysPrintTemplate template) {
    template.setId(id);
    return Result.success(printTemplateService.update(template));
  }

  @Permission(code = "system:printTemplate:delete", name = "删除打印模板")
  @DeleteMapping("/{id}")
  public Result<Boolean> delete(@PathVariable Long id) {
    return Result.success(printTemplateService.delete(id));
  }

  @Permission(code = "system:printTemplate:print", name = "打印预览")
  @GetMapping("/{id}/print")
  public void print(@PathVariable Long id, HttpServletResponse response) throws IOException {
    SysPrintTemplate template = printTemplateService.getById(id);
    if (template != null) {
      response.setContentType("text/html;charset=UTF-8");
      response.getWriter().write(template.getContent());
    }
  }
}