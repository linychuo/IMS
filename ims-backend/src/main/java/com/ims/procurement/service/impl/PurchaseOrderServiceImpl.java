package com.ims.procurement.service.impl;

import com.ims.procurement.dto.request.CreatePurchaseOrderRequest;
import com.ims.procurement.dto.request.UpdatePurchaseOrderRequest;
import com.ims.procurement.entity.PurchaseOrder;
import com.ims.procurement.entity.PurchaseOrderDetail;
import com.ims.procurement.mapper.PurchaseOrderDetailMapper;
import com.ims.procurement.mapper.PurchaseOrderMapper;
import com.ims.procurement.mapper.SupplierMapper;
import com.ims.procurement.service.PurchaseOrderService;
import com.ims.common.util.OrderNoGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 采购订单服务实现
 */
@Service
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private static final Logger log = LoggerFactory.getLogger(PurchaseOrderServiceImpl.class);

    private final PurchaseOrderMapper purchaseOrderMapper;
    private final PurchaseOrderDetailMapper detailMapper;
    private final SupplierMapper supplierMapper;

    public PurchaseOrderServiceImpl(PurchaseOrderMapper purchaseOrderMapper,
                                   PurchaseOrderDetailMapper detailMapper,
                                   SupplierMapper supplierMapper) {
        this.purchaseOrderMapper = purchaseOrderMapper;
        this.detailMapper = detailMapper;
        this.supplierMapper = supplierMapper;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PurchaseOrder create(CreatePurchaseOrderRequest request) {
        var supplier = supplierMapper.selectById(request.getSupplierId());
        if (supplier == null) {
            throw new IllegalArgumentException("供应商不存在");
        }

        var order = new PurchaseOrder();
        order.setOrderNo(OrderNoGenerator.generatePurchaseOrderNo());
        order.setSupplierId(request.getSupplierId());
        order.setSupplierName(supplier.getSupplierName());
        order.setOrderDate(java.time.LocalDate.now());
        order.setExpectedDate(request.getExpectedDate());
        order.setStatus(0);
        order.setRemark(request.getRemark());
        order.setDiscountAmount(request.getDiscountAmount());

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

        for (var detailReq : request.getDetails()) {
            var detail = new PurchaseOrderDetail();
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
            detailMapper.insert(detail);
        }

        log.info("创建采购订单: {}", order.getOrderNo());
        return order;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public PurchaseOrder update(Long id, UpdatePurchaseOrderRequest request) {
        var order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new IllegalArgumentException("订单不存在");
        }
        if (order.getStatus() != 0) {
            throw new IllegalStateException("只有新建状态的订单可以修改");
        }

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

        purchaseOrderMapper.update(order);

        log.info("更新采购订单: {}", order.getOrderNo());
        return order;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void approve(Long id, String userId) {
        var order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new IllegalArgumentException("订单不存在");
        }
        if (order.getStatus() != 1) {
            throw new IllegalStateException("只有待审核状态可以审核");
        }

        order.setStatus(2);
        order.setAuditedBy(userId);
        order.setAuditedAt(java.time.LocalDateTime.now());
        purchaseOrderMapper.update(order);

        log.info("审核采购订单: {}", order.getOrderNo());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void cancel(Long id, String reason) {
        var order = purchaseOrderMapper.selectById(id);
        if (order == null) {
            throw new IllegalArgumentException("订单不存在");
        }
        if (order.getStatus() == 5 || order.getStatus() == 9) {
            throw new IllegalStateException("当前状态不允许取消");
        }

        order.setStatus(9);
        order.setRemark(order.getRemark() + " [取消原因: " + reason + "]");
        purchaseOrderMapper.update(order);

        log.info("取消采购订单: {}", order.getOrderNo());
    }

    @Override
    public PurchaseOrder getById(Long id) {
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
    public void delete(Long id) {
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

    @Override
    public List<PurchaseOrder> getIncomingOrders(Integer days) {
        if (days == null) {
            days = 7; // 默认7天内
        }
        LocalDate threshold = LocalDate.now().plusDays(days);
        return purchaseOrderMapper.selectList(null).stream()
                .filter(o -> o.getExpectedDate() != null
                        && o.getExpectedDate().isAfter(LocalDate.now())
                        && !o.getExpectedDate().isAfter(threshold)
                        && (o.getStatus() == 1 || o.getStatus() == 2)) // 已审核或部分入库
                .toList();
    }

    @Override
    public List<PurchaseOrder> getOverdueOrders() {
        LocalDate today = LocalDate.now();
        return purchaseOrderMapper.selectList(null).stream()
                .filter(o -> o.getExpectedDate() != null
                        && o.getExpectedDate().isBefore(today)
                        && (o.getStatus() == 1 || o.getStatus() == 2)) // 已审核或部分入库
                .toList();
    }
}