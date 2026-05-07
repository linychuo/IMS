package com.ims.procurement.service.impl;

import com.ims.common.enums.CommonStatus;
import com.ims.common.util.OrderNoGenerator;
import com.ims.finance.entity.FinanceIn;
import com.ims.finance.mapper.FinanceInMapper;
import com.ims.finance.service.PayableService;
import com.ims.inventory.service.InventoryService;
import com.ims.procurement.entity.PurchaseReturn;
import com.ims.procurement.entity.PurchaseReturnDetail;
import com.ims.procurement.mapper.PurchaseReturnDetailMapper;
import com.ims.procurement.mapper.PurchaseReturnMapper;
import com.ims.procurement.service.PurchaseReturnService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 采购退货服务实现
 */
@Service
public class PurchaseReturnServiceImpl implements PurchaseReturnService {

    private static final Logger log = LoggerFactory.getLogger(PurchaseReturnServiceImpl.class);

    private final PurchaseReturnMapper purchaseReturnMapper;
    private final PurchaseReturnDetailMapper purchaseReturnDetailMapper;
    private final OrderNoGenerator orderNoGenerator;
    private final InventoryService inventoryService;
    private final FinanceInMapper financeInMapper;
    private final PayableService payableService;

    public PurchaseReturnServiceImpl(PurchaseReturnMapper purchaseReturnMapper,
                                     PurchaseReturnDetailMapper purchaseReturnDetailMapper,
                                     OrderNoGenerator orderNoGenerator,
                                     InventoryService inventoryService,
                                     FinanceInMapper financeInMapper,
                                     PayableService payableService) {
        this.purchaseReturnMapper = purchaseReturnMapper;
        this.purchaseReturnDetailMapper = purchaseReturnDetailMapper;
        this.orderNoGenerator = orderNoGenerator;
        this.inventoryService = inventoryService;
        this.financeInMapper = financeInMapper;
        this.payableService = payableService;
    }

    @Override
    @Transactional
    public PurchaseReturn create(PurchaseReturn purchaseReturn, List<PurchaseReturnDetail> details) {
        // 生成退货单号
        purchaseReturn.setReturnNo(orderNoGenerator.generatePurchaseReturnNo());
        purchaseReturn.setStatus(CommonStatus.PENDING.getCode());
        purchaseReturnMapper.insert(purchaseReturn);

        // 保存明细
        for (PurchaseReturnDetail detail : details) {
            detail.setReturnId(purchaseReturn.getId());
            detail.setReturnNo(purchaseReturn.getReturnNo());
            detail.setCreatedAt(LocalDateTime.now());
        }
        purchaseReturnDetailMapper.batchInsert(details);

        log.info("创建采购退货单: {}", purchaseReturn.getReturnNo());
        return purchaseReturn;
    }

    @Override
    @Transactional
    public PurchaseReturn update(String id, PurchaseReturn purchaseReturn, List<PurchaseReturnDetail> details) {
        PurchaseReturn existing = purchaseReturnMapper.selectById(id);
        if (existing == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (existing.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可修改");
        }
        purchaseReturn.setId(id);
        purchaseReturnMapper.update(purchaseReturn);

        // 更新明细
        purchaseReturnDetailMapper.deleteByReturnId(id);
        for (PurchaseReturnDetail detail : details) {
            detail.setReturnId(id);
            detail.setReturnNo(existing.getReturnNo());
            detail.setCreatedAt(LocalDateTime.now());
        }
        purchaseReturnDetailMapper.batchInsert(details);

        log.info("更新采购退货单: {}", id);
        return purchaseReturn;
    }

    @Override
    @Transactional
    public void approve(String id, String userId) {
        PurchaseReturn purchaseReturn = purchaseReturnMapper.selectById(id);
        if (purchaseReturn == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (purchaseReturn.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可审核");
        }
        purchaseReturn.setAuditedBy(userId);
        purchaseReturn.setAuditedAt(LocalDateTime.now());
        purchaseReturn.setStatus(CommonStatus.APPROVED.getCode());
        purchaseReturnMapper.update(purchaseReturn);
        log.info("审核通过采购退货单: {} by {}", id, userId);
    }

    @Override
    @Transactional
    public void reject(String id, String reason) {
        PurchaseReturn purchaseReturn = purchaseReturnMapper.selectById(id);
        if (purchaseReturn == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (purchaseReturn.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可拒绝");
        }
        purchaseReturn.setStatus(CommonStatus.REJECTED.getCode());
        purchaseReturn.setRemark(reason);
        purchaseReturnMapper.update(purchaseReturn);
        log.info("拒绝采购退货单: {}, 原因: {}", id, reason);
    }

    @Override
    @Transactional
    public void cancel(String id, String reason) {
        PurchaseReturn purchaseReturn = purchaseReturnMapper.selectById(id);
        if (purchaseReturn == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (purchaseReturn.getStatus() == CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成不能取消");
        }
        purchaseReturn.setStatus(CommonStatus.CANCELLED.getCode());
        purchaseReturn.setRemark(reason);
        purchaseReturnMapper.update(purchaseReturn);
        log.info("取消采购退货单: {}, 原因: {}", id, reason);
    }

    @Override
    @Transactional
    public void outbound(String id, String userId) {
        PurchaseReturn purchaseReturn = purchaseReturnMapper.selectById(id);
        if (purchaseReturn == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (purchaseReturn.getStatus() != CommonStatus.APPROVED.getCode()) {
            throw new RuntimeException("只有已审核状态可出库");
        }

        // 出库时扣减库存
        List<PurchaseReturnDetail> details = purchaseReturnDetailMapper.selectByReturnId(id);
        for (PurchaseReturnDetail detail : details) {
            Long productId = Long.parseLong(detail.getProductId());
            Long warehouseId = Long.parseLong(purchaseReturn.getWarehouseId());
            Long locationId = detail.getLocationId() != null ? Long.parseLong(detail.getLocationId()) : null;
            BigDecimal quantity = detail.getQuantity();
            BigDecimal price = detail.getPrice() != null ? detail.getPrice() : BigDecimal.ZERO;

            // 扣减库存
            boolean reduced = inventoryService.reduceStock(
                productId,
                warehouseId,
                locationId,
                quantity,
                purchaseReturn.getReturnNo(),
                "PURCHASE_RETURN",
                Long.parseLong(id)
            );
            if (!reduced) {
                throw new RuntimeException("库存扣减失败: " + detail.getProductName());
            }
            log.info("采购退货出库扣减库存: 商品{} 数量{}", detail.getProductName(), quantity);
        }

        // 自动生成退款记录（应收供应商退款）
        if (purchaseReturn.getRefundAmount() != null && purchaseReturn.getRefundAmount().compareTo(BigDecimal.ZERO) > 0) {
            FinanceIn refund = new FinanceIn();
            refund.setInNo(orderNoGenerator.generateReceiveNo());
            refund.setOrderId(Long.parseLong(purchaseReturn.getPurchaseInId()));
            refund.setAmount(purchaseReturn.getRefundAmount());
            refund.setPayDate(LocalDateTime.now());
            refund.setStatus(1); // 待审核
            financeInMapper.insert(refund);
            log.info("采购退货自动生成退款记录: 退款单号{} 金额{}", refund.getInNo(), purchaseReturn.getRefundAmount());
        }

        purchaseReturn.setStatus(CommonStatus.COMPLETED.getCode());
        purchaseReturnMapper.update(purchaseReturn);
        log.info("采购退货单出库完成: {} by {}", id, userId);
    }

    @Override
    public PurchaseReturn getById(String id) {
        return purchaseReturnMapper.selectById(id);
    }

    @Override
    public PurchaseReturn getByReturnNo(String returnNo) {
        return purchaseReturnMapper.selectByReturnNo(returnNo);
    }

    @Override
    public List<PurchaseReturnDetail> getDetails(String returnId) {
        return purchaseReturnDetailMapper.selectByReturnId(returnId);
    }

    @Override
    public List<PurchaseReturn> list(PurchaseReturn query) {
        return purchaseReturnMapper.selectList(query);
    }

    @Override
    @Transactional
    public void delete(String id) {
        PurchaseReturn purchaseReturn = purchaseReturnMapper.selectById(id);
        if (purchaseReturn == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (purchaseReturn.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可删除");
        }
        purchaseReturnDetailMapper.deleteByReturnId(id);
        purchaseReturnMapper.deleteById(id);
        log.info("删除采购退货单: {}", id);
    }
}