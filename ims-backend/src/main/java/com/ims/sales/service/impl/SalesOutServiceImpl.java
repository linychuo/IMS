package com.ims.sales.service.impl;

import com.ims.common.enums.CommonStatus;
import com.ims.common.util.OrderNoGenerator;
import com.ims.finance.entity.Receivable;
import com.ims.finance.service.ReceivableService;
import com.ims.inventory.service.InventoryService;
import com.ims.sales.entity.SalesOut;
import com.ims.sales.entity.SalesOutDetail;
import com.ims.sales.entity.SalesOutStatusHistory;
import com.ims.sales.mapper.SalesOutDetailMapper;
import com.ims.sales.mapper.SalesOutMapper;
import com.ims.sales.mapper.SalesOutStatusHistoryMapper;
import com.ims.sales.service.SalesOutService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 销售出库服务实现
 */
@Service
public class SalesOutServiceImpl implements SalesOutService {

    private static final Logger log = LoggerFactory.getLogger(SalesOutServiceImpl.class);

    private final SalesOutMapper salesOutMapper;
    private final SalesOutDetailMapper salesOutDetailMapper;
    private final SalesOutStatusHistoryMapper statusHistoryMapper;
    private final OrderNoGenerator orderNoGenerator;
    private final InventoryService inventoryService;
    private final ReceivableService receivableService;

    public SalesOutServiceImpl(SalesOutMapper salesOutMapper,
                                SalesOutDetailMapper salesOutDetailMapper,
                                SalesOutStatusHistoryMapper statusHistoryMapper,
                                OrderNoGenerator orderNoGenerator,
                                InventoryService inventoryService,
                                ReceivableService receivableService) {
        this.salesOutMapper = salesOutMapper;
        this.salesOutDetailMapper = salesOutDetailMapper;
        this.statusHistoryMapper = statusHistoryMapper;
        this.orderNoGenerator = orderNoGenerator;
        this.inventoryService = inventoryService;
        this.receivableService = receivableService;
    }

    private void recordStatusChange(SalesOut out, Integer fromStatus, Integer toStatus, String userId, String remark) {
        SalesOutStatusHistory history = new SalesOutStatusHistory();
        history.setOutId(out.getId());
        history.setOutNo(out.getOutNo());
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        try { history.setOperatorId(Long.parseLong(userId)); } catch (Exception e) { log.warn("解析操作人ID失败: {}", userId); }
        history.setOperateTime(LocalDateTime.now());
        history.setRemark(remark);
        statusHistoryMapper.insert(history);
    }

    @Override
    @Transactional
    public SalesOut create(SalesOut salesOut, List<SalesOutDetail> details) {
        // 生成出库单号
        salesOut.setOutNo(orderNoGenerator.generateSalesOutNo());
        salesOut.setStatus(CommonStatus.PENDING.getCode());
        salesOutMapper.insert(salesOut);

        // 保存明细
        for (SalesOutDetail detail : details) {
            detail.setOutId(salesOut.getId());
            detail.setOutNo(salesOut.getOutNo());
        }
        salesOutDetailMapper.batchInsert(details);

        log.info("创建销售出库单: {}", salesOut.getOutNo());
        return salesOut;
    }

    @Override
    @Transactional
    public void approve(Long id, String userId) {
        SalesOut salesOut = salesOutMapper.selectById(id);
        if (salesOut == null) {
            throw new RuntimeException("出库单不存在: " + id);
        }
        if (salesOut.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待出库状态可审核");
        }

        // 审核时扣减库存 + 释放冻结
        List<SalesOutDetail> details = salesOutDetailMapper.selectByOutId(id);
        Long warehouseId = salesOut.getWarehouseId();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (SalesOutDetail detail : details) {
            Long productId = Long.parseLong(detail.getProductId());
            Long locationId = detail.getLocationId();
            BigDecimal quantity = detail.getQuantity();

            // 解冻预占的库存
            try {
                inventoryService.unfreezeStock(productId, warehouseId, quantity);
                log.info("解冻预占库存: 商品{} 仓库{} 数量{}", productId, warehouseId, quantity);
            } catch (Exception e) {
                throw new RuntimeException("解冻预占库存失败，出库单审核回滚: " + e.getMessage());
            }

            // 使用FIFO扣减库存（自动选择最早批次）
            // 如果明细中没有指定库位和批次，则走FIFO逻辑
            BigDecimal unitCost;
            if (detail.getLocationId() != null && !detail.getLocationId().toString().isEmpty()) {
                // 指定了库位，按库位扣减
                unitCost = inventoryService.reduceStock(
                    productId,
                    warehouseId,
                    detail.getLocationId(),
                    quantity,
                    salesOut.getOutNo(),
                    "SALES_OUT",
                    id
                );
            } else {
                // 未指定库位，使用FIFO自动选择
                unitCost = inventoryService.reduceStockByFifo(
                    productId,
                    warehouseId,
                    null,
                    quantity,
                    null,  // 不指定批次，让系统自动按FIFO选择
                    "SALES_OUT",
                    id
                );
            }
            detail.setCost(unitCost);
            log.info("审核扣减库存: 商品{} 数量{} 单位成本{}", detail.getProductName(), quantity, unitCost);

            // 计算总金额
            totalAmount = totalAmount.add(detail.getPrice().multiply(quantity));
        }

        // 更新出库明细的成本
        for (SalesOutDetail detail : details) {
            if (detail.getCost() != null) {
                salesOutDetailMapper.updateById(detail);
            }
        }

        // 自动生成应收款
        Receivable receivable = new Receivable();
        receivable.setCustomerId(salesOut.getCustomerId());
        receivable.setCustomerName(salesOut.getCustomerName());
        receivable.setOrderType("SALES_OUT");
        receivable.setOrderId(id);
        receivable.setOrderNo(salesOut.getOutNo());
        receivable.setTotalAmount(totalAmount);
        receivable.setDueDate(LocalDate.now().plusDays(30)); // 默认30天账期
        receivableService.create(receivable);
        log.info("自动生成应收款: 客户{} 金额{}", salesOut.getCustomerName(), totalAmount);

        salesOut.setAuditedBy(userId);
        salesOut.setAuditedAt(LocalDateTime.now());
        salesOut.setStatus(CommonStatus.APPROVED.getCode());
        salesOutMapper.update(salesOut);
        recordStatusChange(salesOut, CommonStatus.PENDING.getCode(), CommonStatus.APPROVED.getCode(), userId, "审核通过");
        log.info("审核销售出库单: {} by {}", id, userId);
    }

    @Override
    @Transactional
    public void cancel(Long id, String reason) {
        SalesOut salesOut = salesOutMapper.selectById(id);
        if (salesOut == null) {
            throw new RuntimeException("出库单不存在: " + id);
        }
        if (salesOut.getStatus() == CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成不能取消");
        }

        Integer prevStatus = salesOut.getStatus();

        // 如果已审核，需要恢复库存
        if (salesOut.getStatus() == CommonStatus.APPROVED.getCode()) {
            List<SalesOutDetail> details = salesOutDetailMapper.selectByOutId(id);
            for (SalesOutDetail detail : details) {
                Long productId = Long.parseLong(detail.getProductId());
                Long warehouseId = salesOut.getWarehouseId();
                Long locationId = detail.getLocationId();
                BigDecimal quantity = detail.getQuantity();

                // 恢复库存 (使用 cost 退回，保持成本一致)
                BigDecimal cost = detail.getCost() != null ? detail.getCost() : detail.getPrice();
                inventoryService.addStock(
                    productId,
                    warehouseId,
                    locationId,
                    quantity,
                    cost,
                    salesOut.getOutNo(),
                    "SALES_OUT_CANCEL",
                    id
                );
                log.info("取消恢复库存: 商品{} 数量{} 成本{}", detail.getProductName(), quantity, cost);
            }
        }

        salesOut.setStatus(CommonStatus.CANCELLED.getCode());
        salesOut.setRemark(reason);
        salesOutMapper.update(salesOut);
        recordStatusChange(salesOut, prevStatus, CommonStatus.CANCELLED.getCode(), "0", reason);
        log.info("取消销售出库单: {}, 原因: {}", id, reason);
    }

    @Override
    @Transactional
    public void complete(Long id) {
        SalesOut salesOut = salesOutMapper.selectById(id);
        if (salesOut == null) {
            throw new RuntimeException("出库单不存在: " + id);
        }
        if (salesOut.getStatus() == CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成");
        }

        // 扣减库存
        List<SalesOutDetail> details = salesOutDetailMapper.selectByOutId(id);
        Long warehouseId = salesOut.getWarehouseId();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (SalesOutDetail detail : details) {
            Long productId = Long.parseLong(detail.getProductId());
            Long locationId = detail.getLocationId();
            BigDecimal quantity = detail.getQuantity();

            // 解冻预占的库存
            try {
                inventoryService.unfreezeStock(productId, warehouseId, quantity);
            } catch (Exception e) {
                log.warn("解冻库存失败: {}", e.getMessage());
            }

            // 使用FIFO扣减库存（自动选择最早批次）
            BigDecimal unitCost;
            if (detail.getLocationId() != null && !detail.getLocationId().toString().isEmpty()) {
                unitCost = inventoryService.reduceStock(
                    productId,
                    warehouseId,
                    detail.getLocationId(),
                    quantity,
                    salesOut.getOutNo(),
                    "SALES_OUT",
                    id
                );
            } else {
                unitCost = inventoryService.reduceStockByFifo(
                    productId,
                    warehouseId,
                    null,
                    quantity,
                    null,
                    "SALES_OUT",
                    id
                );
            }
            detail.setCost(unitCost);
            log.info("FIFO扣减库存: 商品{} 数量{} 单位成本{}", detail.getProductName(), quantity, unitCost);

            totalAmount = totalAmount.add(detail.getPrice().multiply(quantity));
        }

        // 更新出库明细的成本
        for (SalesOutDetail detail : details) {
            if (detail.getCost() != null) {
                salesOutDetailMapper.updateById(detail);
            }
        }

        // 自动生成应收款
        if (totalAmount.compareTo(BigDecimal.ZERO) > 0) {
            Receivable receivable = new Receivable();
            receivable.setCustomerId(salesOut.getCustomerId());
            receivable.setCustomerName(salesOut.getCustomerName());
            receivable.setOrderType("SALES_OUT");
            receivable.setOrderId(id);
            receivable.setOrderNo(salesOut.getOutNo());
            receivable.setTotalAmount(totalAmount);
            receivable.setDueDate(LocalDate.now().plusDays(30));
            receivableService.create(receivable);
            log.info("完成出库自动生成应收款: 客户{} 金额{}", salesOut.getCustomerName(), totalAmount);
        }

        salesOut.setStatus(CommonStatus.COMPLETED.getCode());
        salesOutMapper.update(salesOut);
        recordStatusChange(salesOut, CommonStatus.APPROVED.getCode(), CommonStatus.COMPLETED.getCode(), "0", "完成出库");
        log.info("完成销售出库: {}", id);
    }

    @Override
    public SalesOut getById(Long id) {
        return salesOutMapper.selectById(id);
    }

    @Override
    public SalesOut getByOutNo(String outNo) {
        return salesOutMapper.selectByOutNo(outNo);
    }

    @Override
    public List<SalesOutDetail> getDetails(Long outId) {
        return salesOutDetailMapper.selectByOutId(outId);
    }

    @Override
    public List<SalesOut> list(SalesOut query) {
        return salesOutMapper.selectList(query);
    }

    @Override
    @Transactional
    public SalesOut update(Long id, SalesOut salesOut, List<SalesOutDetail> details) {
        SalesOut existing = salesOutMapper.selectById(id);
        if (existing == null) {
            throw new RuntimeException("出库单不存在: " + id);
        }
        if (existing.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待出库状态可编辑");
        }

        salesOut.setId(id);
        salesOut.setOutNo(existing.getOutNo());
        salesOut.setStatus(existing.getStatus());
        salesOutMapper.update(salesOut);

        // 删除旧明细，插入新明细
        salesOutDetailMapper.deleteByOutId(id);
        for (SalesOutDetail detail : details) {
            detail.setOutId(id);
            detail.setOutNo(existing.getOutNo());
        }
        salesOutDetailMapper.batchInsert(details);

        log.info("更新销售出库单: {}", id);
        return salesOut;
    }

    @Override
    @Transactional
    public void delete(Long id) {
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