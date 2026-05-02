package com.ims.procurement.service;

import com.ims.procurement.dto.request.CreatePurchaseOrderRequest;
import com.ims.procurement.dto.request.UpdatePurchaseOrderRequest;
import com.ims.procurement.entity.PurchaseOrder;
import com.ims.procurement.entity.PurchaseOrderDetail;
import com.ims.procurement.mapper.PurchaseOrderDetailMapper;
import com.ims.procurement.mapper.PurchaseOrderMapper;
import com.ims.procurement.mapper.SupplierMapper;
import com.ims.common.util.OrderNoGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 采购订单服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderMapper purchaseOrderMapper;
    private final PurchaseOrderDetailMapper detailMapper;
    private final SupplierMapper supplierMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PurchaseOrder create(CreatePurchaseOrderRequest request) {
        // 查询供应商信息
        var supplier = supplierMapper.selectById(request.getSupplierId());
        if (supplier == null) {
            throw new IllegalArgumentException("供应商不存在");
        }

        // 创建订单
        var order = new PurchaseOrder();
        order.setId(OrderNoGenerator.generateSimpleUUID());
        order.setOrderNo(OrderNoGenerator.generatePurchaseOrderNo());
        order.setSupplierId(request.getSupplierId());
        order.setSupplierName(supplier.getSupplierName());
        order.setOrderDate(java.time.LocalDate.now());
        order.setExpectedDate(request.getExpectedDate());
        order.setStatus(0); // 新建
        order.setRemark(request.getRemark());
        order.setDiscountAmount(request.getDiscountAmount());
        order.setCreatedBy(request.getCreatedBy());
        order.setCreatedAt(LocalDateTime.now());

        // 计算金额
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (var detailReq : request.getDetails()) {
            var amount = detailReq.getPrice().multiply(detailReq.getQuantity());
            totalAmount = totalAmount.add(amount);
        }
        order.setTotalAmount(totalAmount);
        order.setNetAmount(totalAmount.subtract(
                request.getDiscountAmount() != null ? request.getDiscountAmount() : BigDecimal.ZERO
        ));

        purchaseOrderMapper.insert(order);

        // 创建明细
        for (var detailReq : request.getDetails()) {
            var detail = new PurchaseOrderDetail();
            detail.setId(OrderNoGenerator.generateSimpleUUID());
            detail.setOrderId(order.getId());
            detail.setProductId(detailReq.getProductId());
            detail.setBatchNo(detailReq.getBatchNo());
            detail.setUnitId(detailReq.getUnitId());
            detail.setPrice(detailReq.getPrice());
            detail.setQuantity(detailReq.getQuantity());
            detail.setAmount(detailReq.getPrice().multiply(detailReq.getQuantity()));
            detail.setDeliveredQty(BigDecimal.ZERO);
            detail.setReceivedQty(BigDecimal.ZERO);
            detail.setRemark(detailReq.getRemark());
            detail.setCreatedBy(request.getCreatedBy());
            detail.setCreatedAt(LocalDateTime.now());
            detailMapper.insert(detail);
        }

        log.info("创建采购订单: {}", order.getOrderNo());
        return order;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PurchaseOrder update(String id, UpdatePurchaseOrderRequest request) {
        var order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new IllegalArgumentException("订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new IllegalStateException("只有新建状态的订单可以修改");
        }

        // 更新订单
        if (request.getSupplierId() != null) {
            var supplier = supplierMapper.selectById(request.getSupplierId());
            order.setSupplierId(request.getSupplierId());
            order.setSupplierName(supplier.getSupplierName());
        }
        if (request.getExpectedDate() != null) {
            order.setExpectedDate(request.getExpectedDate());
        }
        if (request.getRemark() != null) {
            order.setRemark(request.getRemark());
        }
        order.setUpdatedBy(request.getUpdatedBy());
        order.setUpdatedAt(LocalDateTime.now());

        purchaseOrderMapper.update(order);

        log.info("更新采购订单: {}", order.getOrderNo());
        return order;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void approve(String id, String userId) {
        var order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new IllegalArgumentException("订单不存在");
        }
        if (order.getStatus() != 1) {
            throw new IllegalStateException("只有待审核状态可以审核");
        }

        order.setStatus(2); // 已审核
        order.setAuditedBy(userId);
        order.setAuditedAt(LocalDateTime.now());
        purchaseOrderMapper.update(order);

        log.info("审核采购订单: {}", order.getOrderNo());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancel(String id, String reason) {
        var order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new IllegalArgumentException("订单不存在");
        }
        if (order.getStatus() == 5 || order.getStatus() == 9) {
            throw new IllegalStateException("当前状态不允许取消");
        }

        order.setStatus(9); // 已取消
        order.setRemark(order.getRemark() + " [取消原因: " + reason + "]");
        order.setUpdatedAt(LocalDateTime.now());
        purchaseOrderMapper.update(order);

        log.info("取消采购订单: {}", order.getOrderNo());
    }

    @Override
    public PurchaseOrder getById(String id) {
        return purchaseOrderMapper.selectById(id);
    }

    @Override
    public PurchaseOrder getByOrderNo(String orderNo) {
        return purchaseOrderMapper.selectByOrderNo(orderNo);
    }

    @Override
    public List<PurchaseOrder> list(PurchaseOrder query) {
        return purchaseOrderMapper.selectList(query);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void delete(String id) {
        var order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new IllegalArgumentException("订单不存在");
        }
        if (order.getStatus() != 0 && order.getStatus() != 9) {
            throw new IllegalStateException("只有新建或已取消的订单可以删除");
        }
        detailMapper.deleteByOrderId(id);
        purchaseOrderMapper.deleteById(id);

        log.info("删除采购订单: {}", order.getOrderNo());
    }
}