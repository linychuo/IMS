package com.ims.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.system.entity.ApprovalRule;
import org.apache.ibatis.annotations.Mapper;

/**
 * 审批规则Mapper
 */
@Mapper
public interface ApprovalRuleMapper extends BaseMapper<ApprovalRule> {
}