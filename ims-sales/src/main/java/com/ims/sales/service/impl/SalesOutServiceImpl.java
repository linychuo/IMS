package com.ims.sales.service.impl;

import com.ims.common.enums.CommonStatus;
import com.ims.common.util.OrderNoGenerator;
import com.ims.sales.entity.SalesOut;
import com.ims.sales.entity.SalesOutDetail;
import com.ims.sales.mapper.SalesOutDetailMapper;
import com.ims.sales.mapper.SalesOutMapper;
import com.ims.sales.service.SalesOutService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 销售出库服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SalesOutServiceImpl implements SalesOutService {

    private final SalesOutMapper salesOutMapper;
    private final SalesOutDetailMapper salesOutDetailMapper;
    private final OrderNoGenerator orderNoGenerator;

    @Override
    @Transactional
    public SalesOut create(SalesOut salesOut, List<SalesOutDetail> details) {
        // 生成出库单号
        salesOut.setOutNo(orderNoGenerator.generate("SOUT"));
        salesOut.setStatus(CommonStatus.PENDING.getCode());
        salesOutMapper.insert(salesOut);
        
        // 保存明细
        for (SalesOutDetail detail : details) {
            detail.setOutId(salesOut.getId());
            detail.setOutNo(salesOut.getOutNo());
            detail.setCreatedAt(LocalDateTime.now());
        }
        salesOutDetailMapper.batchInsert(details);
        
        log.info("创建销售出库单: {}", salesOut.getOutNo());
        return salesOut;
    }

    @Override
    @Transactional
    public void approve(String id, String userId) {
        SalesOut salesOut = salesOutMapper.selectById(id);
        if (salesOut == null) {
            throw new RuntimeException("出库单不存在: " + id);
        }
        if (salesOut.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待出库状态可审核");
        }
        salesOut.setAuditedBy(userId);
        salesOut.setAuditedAt(LocalDateTime.now());
        salesOut.setStatus(CommonStatus.APPROVED.getCode());
        salesOutMapper.update(salesOut);
        log.info("审核销售出库单: {} by {}", id, userId);
    }

    @Override
    @Transactional
    public void cancel(String id, String reason) {
        SalesOut salesOut = salesOutMapper.selectById(id);
        if (salesOut == null) {
            throw new RuntimeException("出库单不存在: " + id);
        }
        if (salesOut.getStatus() == CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成不能取消");
        }
        salesOut.setStatus(CommonStatus.CANCELLED.getCode());
        salesOut.setRemark(reason);
        salesOutMapper.update(salesOut);
        log.info("取消销售出库单: {}, 原因: {}", id, reason);
    }

    @Override
    @Transactional
    public void complete(String id) {
        SalesOut salesOut = salesOutMapper.selectById(id);
        if (salesOut == null) {
            throw new RuntimeException("出库单不存在: " + id);
        }
        if (salesOut.getStatus() == CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成");
        }
        salesOut.setStatus(CommonStatus.COMPLETED.getCode());
        salesOutMapper.update(salesOut);
        log.info("完成销售出库: {}", id);
    }

    @Override
    public SalesOut getById(String id) {
        return salesOutMapper.selectById(id);
    }

    @Override
    public SalesOut getByOutNo(String outNo) {
        return salesOutMapper.selectByOutNo(outNo);
    }

    @Override
    public List<SalesOutDetail> getDetails(String outId) {
        return salesOutDetailMapper.selectByOutId(outId);
    }

    @Override
    public List<SalesOut> list(SalesOut query) {
        return salesOutMapper.selectList(query);
    }

    @Override
    @Transactional
    public void delete(String id) {
        SalesOut salesOut = salesOutMapper.selectById(id);
        if (salesOut == null) {
            throw new RuntimeException("出库单不存在: " + id);
        }
        if (salesOut.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待出库状态可删除");
        }
        salesOutDetailMapper.deleteByOutId(id);
        salesOutMapper.deleteById(id);
        log.info("删除销售出库单: {}", id);
    }
}