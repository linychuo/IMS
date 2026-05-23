package com.ims.system.service;

import com.ims.system.entity.ApprovalRule;
import java.math.BigDecimal;
import java.util.List;

/**
 * 审批规则服务接口
 */
public interface ApprovalRuleService {

    /**
     * 根据业务类型和金额获取审批规则
     */
    ApprovalRule getRuleByAmount(String businessType, BigDecimal amount);

    /**
     * 获取所有规则
     */
    List<ApprovalRule> listAll();

    /**
     * 获取规则详情
     */
    ApprovalRule getById(Long id);

    /**
     * 创建规则
     */
    boolean create(ApprovalRule rule);

    /**
     * 更新规则
     */
    boolean update(ApprovalRule rule);

    /**
     * 删除规则
     */
    boolean delete(Long id);

    /**
     * 检查金额是否需要审批
     */
    boolean requiresApproval(String businessType, BigDecimal amount);
}