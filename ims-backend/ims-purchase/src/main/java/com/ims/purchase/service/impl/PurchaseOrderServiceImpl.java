package com.ims.purchase.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.purchase.entity.PurchaseOrder;
import com.ims.purchase.mapper.PurchaseOrderMapper;
import com.ims.purchase.service.PurchaseOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 采购订单Service实现
 */
@Service
public class PurchaseOrderServiceImpl extends ServiceImpl<PurchaseOrderMapper, PurchaseOrder> implements PurchaseOrderService {

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean confirm(Long id) {
        PurchaseOrder order = getById(id);
        if (order == null) {
            throw new RuntimeException("采购订单不存在");
        }
        if (!"1".equals(String.valueOf(order.getStatus()))) {
            throw new RuntimeException("只有待确认状态可以确认");
        }
        order.setStatus(2); // 已确认
        return updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean cancel(Long id, String reason) {
        PurchaseOrder order = getById(id);
        if (order == null) {
            throw new RuntimeException("采购订单不存在");
        }
        if (order.getStatus() == 5) {
            throw new RuntimeException("订单已取消");
        }
        order.setStatus(5); // 已取消
        order.setRemark(reason);
        return updateById(order);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean complete(Long id) {
        PurchaseOrder order = getById(id);
        if (order == null) {
            throw new RuntimeException("采购订单不存在");
        }
        if (order.getStatus() != 3) {
            throw new RuntimeException("只有已入库状态可以完成");
        }
        order.setStatus(4); // 已完成
        return updateById(order);
    }
}