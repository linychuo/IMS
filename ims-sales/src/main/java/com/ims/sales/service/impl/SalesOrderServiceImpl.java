package com.ims.sales.service.impl;

import com.ims.common.enums.CommonStatus;
import com.ims.common.util.OrderNoGenerator;
import com.ims.sales.entity.SalesOrder;
import com.ims.sales.entity.SalesOrderDetail;
import com.ims.sales.mapper.SalesOrderDetailMapper;
import com.ims.sales.mapper.SalesOrderMapper;
import com.ims.sales.service.SalesOrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 销售订单服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SalesOrderServiceImpl implements SalesOrderService {

    private final SalesOrderMapper salesOrderMapper;
    private final SalesOrderDetailMapper salesOrderDetailMapper;
    private final OrderNoGenerator orderNoGenerator;

    @Override
    @Transactional
    public SalesOrder create(SalesOrder salesOrder, List<SalesOrderDetail> details) {
        // 生成订单号
        salesOrder.setOrderNo(orderNoGenerator.generate("SO"));
        salesOrder.setStatus(CommonStatus.PENDING.getCode());
        salesOrderMapper.insert(salesOrder);
        
        // 保存明细
        for (SalesOrderDetail detail : details) {
            detail.setOrderId(salesOrder.getId());
            detail.setOrderNo(salesOrder.getOrderNo());
            detail.setCreatedAt(LocalDateTime.now());
        }
        salesOrderDetailMapper.batchInsert(details);
        
        log.info("创建销售订单: {}", salesOrder.getOrderNo());
        return salesOrder;
    }

    @Override
    @Transactional
    public SalesOrder update(String id, SalesOrder salesOrder, List<SalesOrderDetail> details) {
        SalesOrder existing = salesOrderMapper.selectById(id);
        if (existing == null) {
            throw new RuntimeException("订单不存在: " + id);
        }
        if (existing.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可修改");
        }
        salesOrder.setId(id);
        salesOrder.setUpdatedAt(LocalDateTime.now());
        salesOrderMapper.update(salesOrder);
        
        // 更新明细
        salesOrderDetailMapper.deleteByOrderId(id);
        for (SalesOrderDetail detail : details) {
            detail.setOrderId(id);
            detail.setOrderNo(existing.getOrderNo());
            detail.setCreatedAt(LocalDateTime.now());
        }
        salesOrderDetailMapper.batchInsert(details);
        
        log.info("更新销售订单: {}", id);
        return salesOrder;
    }

    @Override
    @Transactional
    public void approve(String id, String userId) {
        SalesOrder salesOrder = salesOrderMapper.selectById(id);
        if (salesOrder == null) {
            throw new RuntimeException("订单不存在: " + id);
        }
        if (salesOrder.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可审核");
        }
        salesOrder.setAuditedBy(userId);
        salesOrder.setAuditedAt(LocalDateTime.now());
        salesOrder.setStatus(CommonStatus.APPROVED.getCode());
        salesOrderMapper.update(salesOrder);
        log.info("审核销售订单: {} by {}", id, userId);
    }

    @Override
    @Transactional
    public void cancel(String id, String reason) {
        SalesOrder salesOrder = salesOrderMapper.selectById(id);
        if (salesOrder == null) {
            throw new RuntimeException("订单不存在: " + id);
        }
        if (salesOrder.getStatus() == CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成不能取消");
        }
        salesOrder.setStatus(CommonStatus.CANCELLED.getCode());
        salesOrder.setRemark(reason);
        salesOrderMapper.update(salesOrder);
        log.info("取消销售订单: {}, 原因: {}", id, reason);
    }

    @Override
    public SalesOrder getById(String id) {
        return salesOrderMapper.selectById(id);
    }

    @Override
    public SalesOrder getByOrderNo(String orderNo) {
        return salesOrderMapper.selectByOrderNo(orderNo);
    }

    @Override
    public List<SalesOrderDetail> getDetails(String orderId) {
        return salesOrderDetailMapper.selectByOrderId(orderId);
    }

    @Override
    public List<SalesOrder> list(SalesOrder query) {
        return salesOrderMapper.selectList(query);
    }

    @Override
    @Transactional
    public void delete(String id) {
        SalesOrder salesOrder = salesOrderMapper.selectById(id);
        if (salesOrder == null) {
            throw new RuntimeException("订单不存在: " + id);
        }
        if (salesOrder.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可删除");
        }
        salesOrderDetailMapper.deleteByOrderId(id);
        salesOrderMapper.deleteById(id);
        log.info("删除销售订单: {}", id);
    }
}