package com.ims.sales.service.impl;

import com.ims.common.enums.CommonStatus;
import com.ims.common.util.OrderNoGenerator;
import com.ims.inventory.service.InventoryService;
import com.ims.sales.entity.SalesReturn;
import com.ims.sales.entity.SalesReturnDetail;
import com.ims.sales.mapper.SalesReturnDetailMapper;
import com.ims.sales.mapper.SalesReturnMapper;
import com.ims.sales.service.SalesReturnService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 销售退货服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SalesReturnServiceImpl implements SalesReturnService {

    private final SalesReturnMapper salesReturnMapper;
    private final SalesReturnDetailMapper salesReturnDetailMapper;
    private final OrderNoGenerator orderNoGenerator;
    private final InventoryService inventoryService;

    @Override
    @Transactional
    public SalesReturn create(SalesReturn salesReturn, List<SalesReturnDetail> details) {
        // 生成退货单号
        salesReturn.setReturnNo(orderNoGenerator.generate("SR"));
        salesReturn.setStatus(CommonStatus.PENDING.getCode());
        salesReturnMapper.insert(salesReturn);
        
        // 保存明细
        for (SalesReturnDetail detail : details) {
            detail.setReturnId(salesReturn.getId());
            detail.setReturnNo(salesReturn.getReturnNo());
            detail.setCreatedAt(LocalDateTime.now());
        }
        salesReturnDetailMapper.batchInsert(details);
        
        log.info("创建销售退货单: {}", salesReturn.getReturnNo());
        return salesReturn;
    }

    @Override
    @Transactional
    public SalesReturn update(String id, SalesReturn salesReturn, List<SalesReturnDetail> details) {
        SalesReturn existing = salesReturnMapper.selectById(id);
        if (existing == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (existing.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待审核状态可修改");
        }
        salesReturn.setId(id);
        salesReturn.setUpdatedAt(LocalDateTime.now());
        salesReturnMapper.update(salesReturn);
        
        // 更新明细
        salesReturnDetailMapper.deleteByReturnId(id);
        for (SalesReturnDetail detail : details) {
            detail.setReturnId(id);
            detail.setReturnNo(existing.getReturnNo());
            detail.setCreatedAt(LocalDateTime.now());
        }
        salesReturnDetailMapper.batchInsert(details);
        
        log.info("更新销售退货单: {}", id);
        return salesReturn;
    }

    @Override
    @Transactional
    public void approve(String id, String userId) {
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
        log.info("审核通过销售退货单: {} by {}", id, userId);
    }

    @Override
    @Transactional
    public void reject(String id, String reason) {
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
        log.info("拒绝销售退货单: {}, 原因: {}", id, reason);
    }

    @Override
    @Transactional
    public void cancel(String id, String reason) {
        SalesReturn salesReturn = salesReturnMapper.selectById(id);
        if (salesReturn == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (salesReturn.getStatus() == CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成不能取消");
        }
        salesReturn.setStatus(CommonStatus.CANCELLED.getCode());
        salesReturn.setRemark(reason);
        salesReturnMapper.update(salesReturn);
        log.info("取消销售退货单: {}, 原因: {}", id, reason);
    }

    @Override
    @Transactional
    public void inbound(String id, String userId) {
        SalesReturn salesReturn = salesReturnMapper.selectById(id);
        if (salesReturn == null) {
            throw new RuntimeException("退货单不存在: " + id);
        }
        if (salesReturn.getStatus() != CommonStatus.APPROVED.getCode()) {
            throw new RuntimeException("只有已审核状态可入库");
        }
        
        // 入库时增加库存
        List<SalesReturnDetail> details = salesReturnDetailMapper.selectByReturnId(id);
        for (SalesReturnDetail detail : details) {
            Long productId = Long.parseLong(detail.getProductId());
            Long warehouseId = Long.parseLong(salesReturn.getWarehouseId());
            Long locationId = detail.getLocationId() != null ? Long.parseLong(detail.getLocationId()) : null;
            BigDecimal quantity = detail.getQuantity();
            BigDecimal price = detail.getPrice() != null ? detail.getPrice() : BigDecimal.ZERO;
            
            boolean added = inventoryService.addStock(
                productId, 
                warehouseId, 
                locationId, 
                quantity, 
                price,
                salesReturn.getReturnNo(),
                "SALES_RETURN",
                Long.parseLong(id)
            );
            if (!added) {
                throw new RuntimeException("库存增加失败: " + detail.getProductName());
            }
            log.info("退货入库增加库存: 商品{} 数量{}", detail.getProductName(), quantity);
        }
        
        salesReturn.setStatus(CommonStatus.COMPLETED.getCode());
        salesReturnMapper.update(salesReturn);
        log.info("销售退货单入库完成: {} by {}", id, userId);
    }

    @Override
    public SalesReturn getById(String id) {
        return salesReturnMapper.selectById(id);
    }

    @Override
    public SalesReturn getByReturnNo(String returnNo) {
        return salesReturnMapper.selectByReturnNo(returnNo);
    }

    @Override
    public List<SalesReturnDetail> getDetails(String returnId) {
        return salesReturnDetailMapper.selectByReturnId(returnId);
    }

    @Override
    public List<SalesReturn> list(SalesReturn query) {
        return salesReturnMapper.selectList(query);
    }

    @Override
    @Transactional
    public void delete(String id) {
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