package com.ims.system.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 打印模板实体
 */
@Data
@TableName("sys_print_template")
public class SysPrintTemplate {

  @TableId(type = IdType.AUTO)
  private Long id;

  private String templateCode;

  private String templateName;

  /**
   * 模板类型: 1-采购订单 2-销售订单 3-入库单 4-出库单 5-标签
   */
  private Integer templateType;

  private String content;

  /**
   * 是否默认: 0-否 1-是
   */
  private Integer isDefault;

  private Integer status;

  @TableLogic
  private Integer deleted;

  private LocalDateTime createTime;

  private LocalDateTime updateTime;

  private Long creatorId;

  private String creatorName;
}