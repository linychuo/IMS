package com.ims.procurement.service.impl;

import com.ims.common.enums.CommonStatus;
import com.ims.common.util.OrderNoGenerator;
import com.ims.finance.entity.Payable;
import com.ims.finance.service.PayableService;
import com.ims.procurement.entity.PurchaseIn;
import com.ims.procurement.mapper.PurchaseInMapper;
import com.ims.procurement.service.PurchaseInService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 采购入库服务实现
 */
@Service
public class PurchaseInServiceImpl implements PurchaseInService {

    private static final Logger log = LoggerFactory.getLogger(PurchaseInServiceImpl.class);

    private final PurchaseInMapper purchaseInMapper;
    private final OrderNoGenerator orderNoGenerator;
    private final PayableService payableService;

    public PurchaseInServiceImpl(PurchaseInMapper purchaseInMapper,
                                  OrderNoGenerator orderNoGenerator,
                                  PayableService payableService) {
        this.purchaseInMapper = purchaseInMapper;
        this.orderNoGenerator = orderNoGenerator;
        this.payableService = payableService;
    }

    @Override
    @Transactional
    public PurchaseIn create(PurchaseIn purchaseIn) {
        purchaseIn.setInNo(orderNoGenerator.generatePurchaseInNo());
        purchaseIn.setStatus(CommonStatus.PENDING.getCode());
        purchaseInMapper.insert(purchaseIn);
        log.info("创建采购入库单: {}", purchaseIn.getInNo());
        return purchaseIn;
    }

    @Override
    @Transactional
    public PurchaseIn update(Long id, PurchaseIn purchaseIn) {
        PurchaseIn existing = purchaseInMapper.selectById(id);
        if (existing == null) {
            throw new RuntimeException("入库单不存在: " + id);
        }
        if (existing.getStatus() != com.ims.common.enums.CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待入库状态可修改");
        }
        purchaseIn.setId(id);
        purchaseInMapper.update(purchaseIn);
        log.info("更新采购入库单: {}", id);
        return purchaseIn;
    }

    @Override
    @Transactional
    public void approve(Long id, String userId) {
        PurchaseIn purchaseIn = purchaseInMapper.selectById(id);
        if (purchaseIn == null) {
            throw new RuntimeException("入库单不存在: " + id);
        }
        if (purchaseIn.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待入库状态可审核");
        }
        purchaseIn.setAuditedBy(userId);
        purchaseIn.setAuditedAt(LocalDateTime.now());
        purchaseIn.setStatus(CommonStatus.APPROVED.getCode());
        purchaseInMapper.update(purchaseIn);

        Payable payable = new Payable();
        payable.setSupplierId(purchaseIn.getSupplierId());
        payable.setSupplierName(purchaseIn.getSupplierName());
        payable.setOrderType("PURCHASE_IN");
        payable.setOrderId(id);
        payable.setOrderNo(purchaseIn.getInNo());
        payable.setTotalAmount(purchaseIn.getTotalAmount());
        payable.setDueDate(LocalDate.now().plusDays(30));
        payableService.create(payable);

        log.info("审核采购入库单: {} by {}, 自动生成应付账款", id, userId);
    }

    @Override
    @Transactional
    public void cancel(Long id, String reason) {
        PurchaseIn purchaseIn = purchaseInMapper.selectById(id);
        if (purchaseIn == null) {
            throw new RuntimeException("入库单不存在: " + id);
        }
        if (purchaseIn.getStatus() == com.ims.common.enums.CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成不能取消");
        }
        purchaseIn.setStatus(com.ims.common.enums.CommonStatus.CANCELLED.getCode());
        purchaseIn.setRemark(reason);
        purchaseInMapper.update(purchaseIn);
        log.info("取消采购入库单: {}, 原因: {}", id, reason);
    }

    @Override
    @Transactional
    public void complete(Long id) {
        PurchaseIn purchaseIn = purchaseInMapper.selectById(id);
        if (purchaseIn == null) {
            throw new RuntimeException("入库单不存在: " + id);
        }
        if (purchaseIn.getStatus() == com.ims.common.enums.CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成");
        }
        purchaseIn.setStatus(CommonStatus.COMPLETED.getCode());
        purchaseInMapper.update(purchaseIn);
        log.info("完成采购入库: {}", id);
    }

    @Override
    public PurchaseIn getById(Long id) {
        return purchaseInMapper.selectById(id);
    }

    @Override
    public PurchaseIn getByInNo(String inNo) {
        return purchaseInMapper.selectByInNo(inNo);
    }

    @Override
    public List<PurchaseIn> list(PurchaseIn query) {
        return purchaseInMapper.selectList(query);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        PurchaseIn purchaseIn = purchaseInMapper.selectById(id);
        if (purchaseIn == null) {
            throw new RuntimeException("入库单不存在: " + id);
        }
        if (purchaseIn.getStatus() != com.ims.common.enums.CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待入库状态可删除");
        }
        purchaseInMapper.deleteById(id);
        log.info("删除采购入库单: {}", id);
    }
}