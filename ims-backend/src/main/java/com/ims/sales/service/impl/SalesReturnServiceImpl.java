package com.ims.sales.service.impl;

import com.ims.common.enums.CommonStatus;
import com.ims.common.util.OrderNoGenerator;
import com.ims.finance.entity.FinanceOut;
import com.ims.finance.mapper.FinanceOutMapper;
import com.ims.inventory.service.InventoryService;
import com.ims.sales.entity.SalesReturn;
import com.ims.sales.entity.SalesReturnDetail;
import com.ims.sales.entity.SalesReturnStatusHistory;
import com.ims.sales.mapper.SalesReturnDetailMapper;
import com.ims.sales.mapper.SalesReturnMapper;
import com.ims.sales.mapper.SalesReturnStatusHistoryMapper;
import com.ims.sales.service.SalesReturnService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SalesReturnServiceImpl implements SalesReturnService {

    private static final Logger log = LoggerFactory.getLogger(SalesReturnServiceImpl.class);

    private final SalesReturnMapper salesReturnMapper;
    private final SalesReturnDetailMapper salesReturnDetailMapper;
    private final SalesReturnStatusHistoryMapper statusHistoryMapper;
    private final OrderNoGenerator orderNoGenerator;
    private final InventoryService inventoryService;
    private final FinanceOutMapper financeOutMapper;

    public SalesReturnServiceImpl(SalesReturnMapper salesReturnMapper,
                                   SalesReturnDetailMapper salesReturnDetailMapper,
                                   SalesReturnStatusHistoryMapper statusHistoryMapper,
                                   OrderNoGenerator orderNoGenerator,
                                   InventoryService inventoryService,
                                   FinanceOutMapper financeOutMapper) {
        this.salesReturnMapper = salesReturnMapper;
        this.salesReturnDetailMapper = salesReturnDetailMapper;
        this.statusHistoryMapper = statusHistoryMapper;
        this.orderNoGenerator = orderNoGenerator;
        this.inventoryService = inventoryService;
        this.financeOutMapper = financeOutMapper;
    }

    private void recordStatusChange(SalesReturn ret, Integer fromStatus, Integer toStatus, String userId, String remark) {
        SalesReturnStatusHistory history = new SalesReturnStatusHistory();
        history.setReturnId(ret.getId());
        history.setReturnNo(ret.getReturnNo());
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        try { history.setOperatorId(Long.parseLong(userId)); } catch (Exception e) {}
        history.setOperateTime(LocalDateTime.now());
        history.setRemark(remark);
        statusHistoryMapper.insert(history);
    }

    @Override
    @Transactional
    public SalesReturn create(SalesReturn salesReturn, List<SalesReturnDetail> details) {
        salesReturn.setReturnNo(orderNoGenerator.generateSalesReturnNo());
        salesReturn.setStatus(CommonStatus.PENDING.getCode());
        salesReturnMapper.insert(salesReturn);

        for (SalesReturnDetail detail : details) {
            detail.setReturnId(salesReturn.getId());
            detail.setReturnNo(salesReturn.getReturnNo());
        }
        salesReturnDetailMapper.batchInsert(details);

        log.info("创建销售退货单: {}", salesReturn.getReturnNo());
        return salesReturn;
    }

    @Override
    @Transactional
    public SalesReturn update(Long id, SalesReturn salesReturn, List<SalesReturnDetail> details) {
        SalesReturn existing = salesReturnMapper.selectById(id);
        if (existing == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (existing.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可修改");
        }
        salesReturn.setId(id);
        salesReturnMapper.update(salesReturn);

        salesReturnDetailMapper.deleteByReturnId(id);
        for (SalesReturnDetail detail : details) {
            detail.setReturnId(id);
            detail.setReturnNo(existing.getReturnNo());
        }
        salesReturnDetailMapper.batchInsert(details);

        log.info("更新销售退货单: {}", id);
        return salesReturn;
    }

    @Override
    @Transactional
    public void approve(Long id, String userId) {
        SalesReturn salesReturn = salesReturnMapper.selectById(id);
        if (salesReturn == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (salesReturn.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可审核");
        }
        salesReturn.setAuditedBy(userId);
        salesReturn.setAuditedAt(LocalDateTime.now());
        salesReturn.setStatus(CommonStatus.APPROVED.getCode());
        salesReturnMapper.update(salesReturn);
        recordStatusChange(salesReturn, CommonStatus.PENDING.getCode(), CommonStatus.APPROVED.getCode(), userId, "审核通过");
        log.info("审核通过销售退货单: {} by {}", id, userId);
    }

    @Override
    @Transactional
    public void reject(Long id, String reason) {
        SalesReturn salesReturn = salesReturnMapper.selectById(id);
        if (salesReturn == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (salesReturn.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可拒绝");
        }
        salesReturn.setStatus(CommonStatus.REJECTED.getCode());
        salesReturn.setRemark(reason);
        salesReturnMapper.update(salesReturn);
        recordStatusChange(salesReturn, CommonStatus.PENDING.getCode(), CommonStatus.REJECTED.getCode(), "0", reason);
        log.info("拒绝销售退货单: {}, 原因: {}", id, reason);
    }

    @Override
    @Transactional
    public void cancel(Long id, String reason) {
        SalesReturn salesReturn = salesReturnMapper.selectById(id);
        if (salesReturn == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (salesReturn.getStatus() == CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成不能取消");
        }
        Integer prevStatus = salesReturn.getStatus();
        salesReturn.setStatus(CommonStatus.CANCELLED.getCode());
        salesReturn.setRemark(reason);
        salesReturnMapper.update(salesReturn);
        recordStatusChange(salesReturn, prevStatus, CommonStatus.CANCELLED.getCode(), "0", reason);
        log.info("取消销售退货单: {}, 原因: {}", id, reason);
    }

    @Override
    @Transactional
    public void inbound(Long id, String userId) {
        SalesReturn salesReturn = salesReturnMapper.selectById(id);
        if (salesReturn == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (salesReturn.getStatus() != CommonStatus.APPROVED.getCode()) {
            throw new RuntimeException("只有已审核状态可入库");
        }

        List<SalesReturnDetail> details = salesReturnDetailMapper.selectByReturnId(id);
        for (SalesReturnDetail detail : details) {
            Long productId = Long.parseLong(detail.getProductId());
            Long warehouseId = salesReturn.getWarehouseId();
            Long locationId = detail.getLocationId();
            BigDecimal quantity = detail.getQuantity();
            BigDecimal price = detail.getPrice() != null ? detail.getPrice() : BigDecimal.ZERO;

            boolean added = inventoryService.addStock(
                productId, warehouseId, locationId, quantity, price,
                salesReturn.getReturnNo(), "SALES_RETURN", id
            );
            if (!added) {
                throw new RuntimeException("库存增加失败: " + detail.getProductName());
            }
            log.info("退货入库增加库存: 商品{} 数量{}", detail.getProductName(), quantity);
        }

        if (salesReturn.getRefundAmount() != null && salesReturn.getRefundAmount().compareTo(BigDecimal.ZERO) > 0) {
            FinanceOut refund = new FinanceOut();
            refund.setOutNo(orderNoGenerator.generateFinanceOutNo());
            refund.setOrderId(salesReturn.getOrderId());
            refund.setSupplierId(salesReturn.getCustomerId());
            refund.setAmount(salesReturn.getRefundAmount());
            refund.setPayDate(LocalDateTime.now());
            refund.setStatus(1);
            financeOutMapper.insert(refund);
            log.info("销售退货自动生成退款记录: 退款单号{} 金额{}", refund.getOutNo(), salesReturn.getRefundAmount());
        }

        salesReturn.setStatus(CommonStatus.COMPLETED.getCode());
        salesReturnMapper.update(salesReturn);
        recordStatusChange(salesReturn, CommonStatus.APPROVED.getCode(), CommonStatus.COMPLETED.getCode(), userId, "退货入库完成");
        log.info("销售退货单入库完成: {} by {}", id, userId);
    }

    @Override
    public SalesReturn getById(Long id) {
        return salesReturnMapper.selectById(id);
    }

    @Override
    public SalesReturn getByReturnNo(String returnNo) {
        return salesReturnMapper.selectByReturnNo(returnNo);
    }

    @Override
    public List<SalesReturnDetail> getDetails(Long returnId) {
        return salesReturnDetailMapper.selectByReturnId(returnId);
    }

    @Override
    public List<SalesReturn> list(SalesReturn query) {
        return salesReturnMapper.selectList(query);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        SalesReturn salesReturn = salesReturnMapper.selectById(id);
        if (salesReturn == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (salesReturn.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可删除");
        }
        salesReturnDetailMapper.deleteByReturnId(id);
        salesReturnMapper.deleteById(id);
        log.info("删除销售退货单: {}", id);
    }
}