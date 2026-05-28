package com.ims.system.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.system.entity.DocumentNoRule;

/**
 * 单据编号规则Service
 */
public interface DocumentNoRuleService extends IService<DocumentNoRule> {

    /**
     * 生成单据编号
     * @param bizType 业务类型
     * @return 生成的编号
     */
    String generateNo(String bizType);
}
