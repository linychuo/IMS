package com.ims.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ims.system.entity.ApprovalRule;
import com.ims.system.mapper.ApprovalRuleMapper;
import com.ims.system.service.ApprovalRuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 审批规则服务实现
 */
@Service
public class ApprovalRuleServiceImpl implements ApprovalRuleService {

    @Autowired
    private ApprovalRuleMapper approvalRuleMapper;

    @Override
    public ApprovalRule getRuleByAmount(String businessType, BigDecimal amount) {
        LambdaQueryWrapper<ApprovalRule> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ApprovalRule::getBusinessType, businessType)
                .eq(ApprovalRule::getStatus, 1)
                .le(ApprovalRule::getMinAmount, amount)
                .or()
                .eq(ApprovalRule::getBusinessType, businessType)
                .eq(ApprovalRule::getStatus, 1)
                .isNull(ApprovalRule::getMaxAmount)
                .le(ApprovalRule::getMinAmount, amount)
                .orderByDesc(ApprovalRule::getMinAmount)
                .last("LIMIT 1");
        return approvalRuleMapper.selectOne(wrapper);
    }

    @Override
    public List<ApprovalRule> listAll() {
        LambdaQueryWrapper<ApprovalRule> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(ApprovalRule::getBusinessType, ApprovalRule::getMinAmount);
        return approvalRuleMapper.selectList(wrapper);
    }

    @Override
    public ApprovalRule getById(Long id) {
        return approvalRuleMapper.selectById(id);
    }

    @Override
    @Transactional
    public boolean create(ApprovalRule rule) {
        rule.setCreateTime(LocalDateTime.now());
        rule.setStatus(1);
        return approvalRuleMapper.insert(rule) > 0;
    }

    @Override
    @Transactional
    public boolean update(ApprovalRule rule) {
        rule.setUpdateTime(LocalDateTime.now());
        return approvalRuleMapper.updateById(rule) > 0;
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        return approvalRuleMapper.deleteById(id) > 0;
    }

    @Override
    public boolean requiresApproval(String businessType, BigDecimal amount) {
        ApprovalRule rule = getRuleByAmount(businessType, amount);
        return rule != null && rule.getApprovalLevel() != null && rule.getApprovalLevel() > 0;
    }
}