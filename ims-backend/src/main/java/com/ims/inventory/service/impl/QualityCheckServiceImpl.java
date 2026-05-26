package com.ims.inventory.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.core.result.PageResult;
import com.ims.inventory.entity.QualityCheck;
import com.ims.inventory.entity.QualityCheckDetail;
import com.ims.inventory.mapper.QualityCheckDetailMapper;
import com.ims.inventory.mapper.QualityCheckMapper;
import com.ims.inventory.service.QualityCheckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 质检单 Service 实现
 */
@Service
public class QualityCheckServiceImpl extends ServiceImpl<QualityCheckMapper, QualityCheck> implements QualityCheckService {

    @Autowired
    private QualityCheckDetailMapper qualityCheckDetailMapper;

    @Override
    public PageResult<QualityCheck> page(Long page, Long pageSize, String orderType, Integer status) {
        LambdaQueryWrapper<QualityCheck> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(orderType != null, QualityCheck::getOrderType, orderType)
              .eq(status != null, QualityCheck::getStatus, status)
              .orderByDesc(QualityCheck::getId);
        Page<QualityCheck> result = this.page(new Page<>(page, pageSize), wrapper);
        return PageResult.of(result);
    }

    @Override
    public QualityCheck getById(Long id) {
        return this.getById(id);
    }

    @Override
    @Transactional
    public QualityCheck create(QualityCheck check, List<QualityCheckDetail> details) {
        check.setCheckNo("QC" + System.currentTimeMillis());
        check.setStatus(0); // 待质检
        check.setCreateTime(LocalDateTime.now());
        this.save(check);

        for (QualityCheckDetail detail : details) {
            detail.setCheckId(check.getId());
            detail.setCheckNo(check.getCheckNo());
            detail.setCreateTime(LocalDateTime.now());
            qualityCheckDetailMapper.insert(detail);
        }
        return check;
    }

    @Override
    @Transactional
    public boolean updateResult(Long id, String checkResult, BigDecimal qualifiedQty, BigDecimal unqualifiedQty, String remark) {
        QualityCheck check = this.getById(id);
        if (check == null || check.getStatus() != 0) {
            return false;
        }
        check.setCheckResult(checkResult);
        check.setQualifiedQty(qualifiedQty);
        check.setUnqualifiedQty(unqualifiedQty);
        check.setRemark(remark);
        check.setStatus(1); // 质检中
        return this.updateById(check);
    }

    @Override
    @Transactional
    public boolean submit(Long id, Long inspectorId, String inspectorName) {
        QualityCheck check = this.getById(id);
        if (check == null || check.getStatus() != 1) {
            return false;
        }
        check.setInspectorId(inspectorId);
        check.setInspectorName(inspectorName);
        check.setCheckTime(LocalDateTime.now());
        check.setStatus(2); // 已完成
        return this.updateById(check);
    }

    @Override
    @Transactional
    public boolean cancel(Long id, String reason) {
        QualityCheck check = this.getById(id);
        if (check == null || check.getStatus() == 2) {
            return false; // 已完成不能取消
        }
        check.setStatus(9); // 已取消
        check.setRemark(reason);
        return this.updateById(check);
    }

    @Override
    public List<QualityCheckDetail> getDetails(Long checkId) {
        LambdaQueryWrapper<QualityCheckDetail> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(QualityCheckDetail::getCheckId, checkId);
        return qualityCheckDetailMapper.selectList(wrapper);
    }
}