package com.ims.system.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.system.entity.DocumentNoRule;
import com.ims.system.mapper.DocumentNoRuleMapper;
import com.ims.system.service.DocumentNoRuleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 单据编号规则Service实现
 */
@Service
public class DocumentNoRuleServiceImpl extends ServiceImpl<DocumentNoRuleMapper, DocumentNoRule> implements DocumentNoRuleService {

    @Override
    @Transactional
    public String generateNo(String bizType) {
        LambdaQueryWrapper<DocumentNoRule> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(DocumentNoRule::getBizType, bizType)
                .eq(DocumentNoRule::getStatus, 1);
        DocumentNoRule rule = getOne(wrapper);

        if (rule == null) {
            throw new RuntimeException("未找到单据编号规则: " + bizType);
        }

        // 检查是否需要重置序列号
        LocalDate today = LocalDate.now();
        String lastResetKey = getLastResetKey(rule, today);

        if (shouldReset(rule, today)) {
            rule.setCurrentSeq(1L);
            updateById(rule);
        } else {
            // 序列号递增
            rule.setCurrentSeq(rule.getCurrentSeq() + rule.getStep());
            updateById(rule);
        }

        // 拼接编号: 前缀 + 日期 + 序列号
        StringBuilder no = new StringBuilder();
        no.append(rule.getPrefix() != null ? rule.getPrefix() : "");

        if (rule.getDateFormat() != null && !rule.getDateFormat().isEmpty()) {
            no.append(today.format(DateTimeFormatter.ofPattern(rule.getDateFormat())));
        }

        // 序列号补零
        String seq = String.valueOf(rule.getCurrentSeq());
        if (rule.getSeqLength() != null && rule.getSeqLength() > 0) {
            seq = String.format("%0" + rule.getSeqLength() + "d", rule.getCurrentSeq());
        }
        no.append(seq);

        return no.toString();
    }

    private boolean shouldReset(DocumentNoRule rule, LocalDate today) {
        if (rule.getResetFrequency() == null || "NEVER".equals(rule.getResetFrequency())) {
            return false;
        }
        // 简化判断，实际应该根据lastResetKey判断
        return true;
    }

    private String getLastResetKey(DocumentNoRule rule, LocalDate today) {
        return switch (rule.getResetFrequency()) {
            case "DAILY" -> today.toString();
            case "MONTHLY" -> today.getYear() + "-" + today.getMonthValue();
            case "YEARLY" -> String.valueOf(today.getYear());
            default -> "NEVER";
        };
    }

    /**
     * 初始化默认规则（供数据初始化使用）
     */
    public List<DocumentNoRule> getDefaultRules() {
        return List.of(
            createRule("PO", "采购订单", "PO", "yyyyMMdd", 5, 1L, 1, "DAILY"),
            createRule("PI", "采购入库", "PI", "yyyyMMdd", 5, 1L, 1, "DAILY"),
            createRule("SO", "销售订单", "SO", "yyyyMMdd", 5, 1L, 1, "DAILY"),
            createRule("SI", "销售出库", "SI", "yyyyMMdd", 5, 1L, 1, "DAILY"),
            createRule("SR", "销售退货", "SR", "yyyyMMdd", 5, 1L, 1, "DAILY"),
            createRule("PR", "采购退货", "PR", "yyyyMMdd", 5, 1L, 1, "DAILY"),
            createRule("TR", "库存调拨", "TR", "yyyyMMdd", 5, 1L, 1, "DAILY"),
            createRule("IV", "库存盘点", "IV", "yyyyMMdd", 5, 1L, 1, "DAILY"),
            createRule("RC", "收款单", "RC", "yyyyMMdd", 5, 1L, 1, "DAILY"),
            createRule("PA", "付款单", "PA", "yyyyMMdd", 5, 1L, 1, "DAILY")
        );
    }

    private DocumentNoRule createRule(String bizType, String bizName, String prefix,
                                      String dateFormat, int seqLength, long currentSeq,
                                      int step, String resetFrequency) {
        DocumentNoRule rule = new DocumentNoRule();
        rule.setBizType(bizType);
        rule.setBizName(bizName);
        rule.setPrefix(prefix);
        rule.setDateFormat(dateFormat);
        rule.setSeqLength(seqLength);
        rule.setCurrentSeq(currentSeq);
        rule.setStep(step);
        rule.setResetFrequency(resetFrequency);
        rule.setStatus(1);
        return rule;
    }
}
