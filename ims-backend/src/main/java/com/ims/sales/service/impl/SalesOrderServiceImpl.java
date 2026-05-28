package com.ims.sales.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.ims.common.enums.CommonStatus;
import com.ims.common.util.OrderNoGenerator;
import com.ims.core.result.PageResult;
import com.ims.customer.entity.Customer;
import com.ims.customer.mapper.CustomerMapper;
import com.ims.inventory.service.InventoryService;
import com.ims.sales.entity.SalesOrder;
import com.ims.sales.entity.SalesOrderDetail;
import com.ims.sales.entity.SalesOrderStatusHistory;
import com.ims.sales.mapper.SalesOrderDetailMapper;
import com.ims.sales.mapper.SalesOrderMapper;
import com.ims.sales.mapper.SalesOrderStatusHistoryMapper;
import com.ims.sales.service.SalesOrderService;
import com.ims.sales.service.SalesPriceStrategyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 销售订单服务实现
 */
@Service
public class SalesOrderServiceImpl implements SalesOrderService {

    private static final Logger log = LoggerFactory.getLogger(SalesOrderServiceImpl.class);

    private final SalesOrderMapper salesOrderMapper;
    private final SalesOrderDetailMapper salesOrderDetailMapper;
    private final SalesOrderStatusHistoryMapper statusHistoryMapper;
    private final OrderNoGenerator orderNoGenerator;
    private final CustomerMapper customerMapper;
    private final InventoryService inventoryService;
    private final SalesPriceStrategyService priceStrategyService;

    public SalesOrderServiceImpl(SalesOrderMapper salesOrderMapper,
                                  SalesOrderDetailMapper salesOrderDetailMapper,
                                  SalesOrderStatusHistoryMapper statusHistoryMapper,
                                  OrderNoGenerator orderNoGenerator,
                                  CustomerMapper customerMapper,
                                  InventoryService inventoryService,
                                  SalesPriceStrategyService priceStrategyService) {
        this.salesOrderMapper = salesOrderMapper;
        this.salesOrderDetailMapper = salesOrderDetailMapper;
        this.statusHistoryMapper = statusHistoryMapper;
        this.orderNoGenerator = orderNoGenerator;
        this.customerMapper = customerMapper;
        this.inventoryService = inventoryService;
        this.priceStrategyService = priceStrategyService;
    }

    @Override
    @Transactional
    public SalesOrder create(SalesOrder salesOrder, List<SalesOrderDetail> details) {
        // 获取客户信息检查信用额度
        Long customerId = salesOrder.getCustomerId();
        Customer customer = customerMapper.selectById(customerId);
        if (customer == null) {
            throw new RuntimeException("客户不存在");
        }

        // 应用客户等级价格策略
        BigDecimal orderAmount = BigDecimal.ZERO;
        for (SalesOrderDetail detail : details) {
            BigDecimal finalPrice = priceStrategyService.getPrice(
                customerId,
                detail.getProductId(),
                detail.getPrice()
            );
            detail.setPrice(finalPrice);
            orderAmount = orderAmount.add(finalPrice.multiply(detail.getQuantity()));
        }

        // 检查客户信用额度 (信用额度 - 已用信用 >= 订单金额)
        if (customer.getCreditLimit() != null && customer.getReceivableAmount() != null) {
            BigDecimal availableCredit = customer.getCreditLimit().subtract(customer.getReceivableAmount());
            if (orderAmount.compareTo(availableCredit) > 0) {
                throw new RuntimeException("客户信用额度不足，可用额度: " + availableCredit + "，订单金额: " + orderAmount);
            }
        }

        // 生成订单号
        salesOrder.setOrderNo(orderNoGenerator.generateSalesOrderNo());
        salesOrder.setStatus(CommonStatus.PENDING.getCode());
        salesOrderMapper.insert(salesOrder);

        // 记录状态变更历史
        recordStatusChange(salesOrder, null, CommonStatus.PENDING.getCode(), null, "创建订单");

        // 保存明细
        for (SalesOrderDetail detail : details) {
            detail.setOrderId(salesOrder.getId());
            detail.setOrderNo(salesOrder.getOrderNo());
        }
        salesOrderDetailMapper.batchInsert(details);

        log.info("创建销售订单: {}，金额: {}，信用检查通过，应用客户等级价格", salesOrder.getOrderNo(), orderAmount);
        return salesOrder;
    }

    @Override
    @Transactional
    public SalesOrder update(Long id, SalesOrder salesOrder, List<SalesOrderDetail> details) {
        SalesOrder existing = salesOrderMapper.selectById(id);
        if (existing == null) {
            throw new RuntimeException("订单不存在: " + id);
        }
        if (existing.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可修改");
        }
        salesOrder.setId(id);
        salesOrderMapper.update(salesOrder);

        // 更新明细
        salesOrderDetailMapper.deleteByOrderId(id);
        for (SalesOrderDetail detail : details) {
            detail.setOrderId(id);
            detail.setOrderNo(existing.getOrderNo());
        }
        salesOrderDetailMapper.batchInsert(details);
        
        log.info("更新销售订单: {}", id);
        return salesOrder;
    }

    @Override
    @Transactional
    public void approve(Long id, String userId) {
        SalesOrder salesOrder = salesOrderMapper.selectById(id);
        if (salesOrder == null) {
            throw new RuntimeException("订单不存在: " + id);
        }
        if (salesOrder.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可审核");
        }

        // 审核时预占库存（冻结库存）
        // 使用仓库ID 1作为默认值，实际应从订单或商品配置获取
        List<SalesOrderDetail> details = salesOrderDetailMapper.selectByOrderId(id);
        for (SalesOrderDetail detail : details) {
            try {
                Long productId = detail.getProductId();
                inventoryService.freezeStock(productId, 1L, detail.getQuantity());
            } catch (Exception e) {
                throw new RuntimeException("预占库存失败，订单审核回滚: orderId=" + id + ", productId=" + detail.getProductId() + ", error=" + e.getMessage());
            }
        }

        // 审核通过
        salesOrder.setAuditedBy(userId);
        salesOrder.setAuditedAt(LocalDateTime.now());
        salesOrder.setStatus(CommonStatus.APPROVED.getCode());
        salesOrderMapper.update(salesOrder);

        // 记录状态变更历史
        recordStatusChange(salesOrder, CommonStatus.PENDING.getCode(), CommonStatus.APPROVED.getCode(), userId, "审核通过");

        log.info("审核销售订单: {} by {}，已预占库存", id, userId);
    }

    @Override
    @Transactional
    public void cancel(Long id, String reason) {
        SalesOrder salesOrder = salesOrderMapper.selectById(id);
        if (salesOrder == null) {
            throw new RuntimeException("订单不存在: " + id);
        }
        if (salesOrder.getStatus() == CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成不能取消");
        }

        // 如果是已审核状态，释放预占的库存
        Integer oldStatus = salesOrder.getStatus();
        if (salesOrder.getStatus() == CommonStatus.APPROVED.getCode()) {
            List<SalesOrderDetail> details = salesOrderDetailMapper.selectByOrderId(id);
            for (SalesOrderDetail detail : details) {
                try {
                    Long productId = detail.getProductId();
                    inventoryService.unfreezeStock(productId, 1L, detail.getQuantity());
                } catch (Exception e) {
                    throw new RuntimeException("释放预占库存失败，取消操作回滚: orderId=" + id + ", productId=" + detail.getProductId() + ", error=" + e.getMessage());
                }
            }
        }

        salesOrder.setStatus(CommonStatus.CANCELLED.getCode());
        salesOrder.setRemark(reason);
        salesOrderMapper.update(salesOrder);

        // 记录状态变更历史
        recordStatusChange(salesOrder, oldStatus, CommonStatus.CANCELLED.getCode(), null, reason);

        log.info("取消销售订单: {}, 原因: {}", id, reason);
    }

    @Override
    public SalesOrder getById(Long id) {
        return salesOrderMapper.selectById(id);
    }

    @Override
    public SalesOrder getByOrderNo(String orderNo) {
        return salesOrderMapper.selectByOrderNo(orderNo);
    }

    @Override
    public List<SalesOrderDetail> getDetails(Long orderId) {
        return salesOrderDetailMapper.selectByOrderId(orderId);
    }

    @Override
    public List<SalesOrder> list(SalesOrder query) {
        return salesOrderMapper.selectList(query);
    }

    @Override
    public PageResult<SalesOrder> page(Long current, Long size, SalesOrder query) {
        Page<SalesOrder> page = new Page<>(current, size);
        // Use the custom selectList from XML which has proper query logic
        List<SalesOrder> records = salesOrderMapper.selectList(query);
        // For pagination, manually slice the list (or use SQL with LIMIT/OFFSET)
        int start = (int) ((current - 1) * size);
        int end = (int) (start + size);
        List<SalesOrder> pagedRecords = records.size() > start ?
            records.subList(start, Math.min(end, records.size())) : List.of();
        return PageResult.build(pagedRecords, (long) records.size(), current, size);
    }

    @Override
    @Transactional
    public void delete(Long id) {
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

    @Override
    public List<SalesOrderStatusHistory> getStatusHistory(Long orderId) {
        return statusHistoryMapper.selectByOrderId(orderId);
    }

    @Override
    public BigDecimal getPrice(Long customerId, Long productId, BigDecimal standardPrice) {
        return priceStrategyService.getPrice(customerId, productId, standardPrice);
    }

    /**
     * 记录状态变更历史
     */
    private void recordStatusChange(SalesOrder order, Integer fromStatus, Integer toStatus, String userName, String remark) {
        SalesOrderStatusHistory history = new SalesOrderStatusHistory();
        history.setOrderId(order.getId());
        history.setOrderNo(order.getOrderNo());
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        history.setOperatorName(userName);
        history.setOperateTime(LocalDateTime.now());
        history.setRemark(remark);
        statusHistoryMapper.insert(history);
    }
}