package com.ims.procurement.service.impl;

import com.ims.common.enums.CommonStatus;
import com.ims.common.util.OrderNoGenerator;
import com.ims.finance.entity.Payable;
import com.ims.finance.service.PayableService;
import com.ims.procurement.dto.request.InspectionRequest;
import com.ims.procurement.entity.PurchaseIn;
import com.ims.procurement.entity.PurchaseInDetail;
import com.ims.procurement.entity.PurchaseInStatusHistory;
import com.ims.procurement.mapper.PurchaseInDetailMapper;
import com.ims.procurement.mapper.PurchaseInMapper;
import com.ims.procurement.mapper.PurchaseInStatusHistoryMapper;
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
    private final PurchaseInDetailMapper purchaseInDetailMapper;
    private final PurchaseInStatusHistoryMapper statusHistoryMapper;
    private final OrderNoGenerator orderNoGenerator;
    private final PayableService payableService;

    public PurchaseInServiceImpl(PurchaseInMapper purchaseInMapper,
                                  PurchaseInDetailMapper purchaseInDetailMapper,
                                  PurchaseInStatusHistoryMapper statusHistoryMapper,
                                  OrderNoGenerator orderNoGenerator,
                                  PayableService payableService) {
        this.purchaseInMapper = purchaseInMapper;
        this.purchaseInDetailMapper = purchaseInDetailMapper;
        this.statusHistoryMapper = statusHistoryMapper;
        this.orderNoGenerator = orderNoGenerator;
        this.payableService = payableService;
    }

    private void recordStatusChange(PurchaseIn in, Integer fromStatus, Integer toStatus, String userId, String remark) {
        PurchaseInStatusHistory history = new PurchaseInStatusHistory();
        history.setInId(in.getId());
        history.setInNo(in.getInNo());
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        try { history.setOperatorId(Long.parseLong(userId)); } catch (Exception e) {}
        history.setOperateTime(LocalDateTime.now());
        history.setRemark(remark);
        statusHistoryMapper.insert(history);
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

        recordStatusChange(purchaseIn, CommonStatus.PENDING.getCode(), CommonStatus.APPROVED.getCode(), userId, "审核通过");

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
        Integer prevStatus = purchaseIn.getStatus();
        purchaseIn.setStatus(com.ims.common.enums.CommonStatus.CANCELLED.getCode());
        purchaseIn.setRemark(reason);
        purchaseInMapper.update(purchaseIn);
        recordStatusChange(purchaseIn, prevStatus, com.ims.common.enums.CommonStatus.CANCELLED.getCode(), "0", reason);
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
        Integer prevStatus = purchaseIn.getStatus();
        purchaseIn.setStatus(CommonStatus.COMPLETED.getCode());
        purchaseInMapper.update(purchaseIn);
        recordStatusChange(purchaseIn, prevStatus, CommonStatus.COMPLETED.getCode(), "0", "完成入库");
        log.info("完成采购入库: {}", id);
    }

    @Override
    @Transactional
    public void inspect(Long id, InspectionRequest request) {
        PurchaseIn purchaseIn = purchaseInMapper.selectById(id);
        if (purchaseIn == null) {
            throw new RuntimeException("入库单不存在: " + id);
        }
        if (purchaseIn.getStatus() != CommonStatus.APPROVED.getCode()) {
            throw new RuntimeException("只有已审核状态可检验");
        }

        for (InspectionRequest.InspectionItem item : request.getItems()) {
            purchaseInDetailMapper.updateCheckStatus(
                item.getDetailId(),
                item.getCheckStatus(),
                item.getCheckedQty()
            );
        }

        boolean allPassed = request.getItems().stream()
            .allMatch(item -> item.getCheckStatus() == 1);
        boolean anyFailed = request.getItems().stream()
            .anyMatch(item -> item.getCheckStatus() == 2);

        if (allPassed) {
            log.info("采购入库单 {} 检验全部通过", id);
        } else if (anyFailed) {
            log.warn("采购入库单 {} 检验存在不合格品", id);
        }

        log.info("提交采购入库检验结果: {}, 明细数: {}", id, request.getItems().size());
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