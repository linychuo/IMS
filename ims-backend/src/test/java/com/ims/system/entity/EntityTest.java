package com.ims.system.entity;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * System模块实体单元测试
 */
class ApprovalRuleTest {

    @Test
    void testApprovalRuleEntity() {
        ApprovalRule rule = new ApprovalRule();
        rule.setRuleCode("PO_APPROVE_1");
        rule.setRuleName("采购订单一级审批");
        rule.setBusinessType("PURCHASE_ORDER");
        rule.setMinAmount(BigDecimal.ZERO);
        rule.setMaxAmount(BigDecimal.valueOf(10000));
        rule.setApprovalLevel(1);
        rule.setApproverRole("MANAGER");
        rule.setStatus(1);
        rule.setRemark("测试规则");

        assertEquals("PO_APPROVE_1", rule.getRuleCode());
        assertEquals("采购订单一级审批", rule.getRuleName());
        assertEquals("PURCHASE_ORDER", rule.getBusinessType());
        assertEquals(BigDecimal.ZERO, rule.getMinAmount());
        assertEquals(BigDecimal.valueOf(10000), rule.getMaxAmount());
        assertEquals(1, rule.getApprovalLevel());
        assertEquals("MANAGER", rule.getApproverRole());
        assertEquals(1, rule.getStatus());
    }

    @Test
    void testApprovalRuleWithNullMaxAmount() {
        ApprovalRule rule = new ApprovalRule();
        rule.setRuleCode("PO_APPROVE_UNLIMITED");
        rule.setRuleName("采购订单无限制审批");
        rule.setBusinessType("PURCHASE_ORDER");
        rule.setMinAmount(BigDecimal.valueOf(10000));
        rule.setMaxAmount(null); // 无上限
        rule.setApprovalLevel(2);
        rule.setStatus(1);

        assertEquals("PO_APPROVE_UNLIMITED", rule.getRuleCode());
        assertEquals(BigDecimal.valueOf(10000), rule.getMinAmount());
        assertNull(rule.getMaxAmount());
        assertEquals(2, rule.getApprovalLevel());
    }

    @Test
    void testApprovalRuleLevels() {
        // 验证审批级别
        ApprovalRule level1 = new ApprovalRule();
        level1.setApprovalLevel(1);
        assertEquals(1, level1.getApprovalLevel());

        ApprovalRule level2 = new ApprovalRule();
        level2.setApprovalLevel(2);
        assertEquals(2, level2.getApprovalLevel());

        ApprovalRule level3 = new ApprovalRule();
        level3.setApprovalLevel(3);
        assertEquals(3, level3.getApprovalLevel());
    }

    @Test
    void testBusinessTypes() {
        // 验证业务类型
        String[] businessTypes = {"PURCHASE_ORDER", "SALES_ORDER", "PURCHASE_RETURN", "SALES_RETURN"};
        for (String type : businessTypes) {
            ApprovalRule rule = new ApprovalRule();
            rule.setBusinessType(type);
            assertEquals(type, rule.getBusinessType());
        }
    }
}
