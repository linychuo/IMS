package com.ims.sales.service.impl;

import com.ims.common.enums.CommonStatus;
import com.ims.common.util.OrderNoGenerator;
import com.ims.inventory.service.InventoryService;
import com.ims.sales.entity.SalesOut;
import com.ims.sales.entity.SalesOutDetail;
import com.ims.sales.mapper.SalesOutDetailMapper;
import com.ims.sales.mapper.SalesOutMapper;
import com.ims.sales.service.SalesOutService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 销售出库服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SalesOutServiceImpl implements SalesOutService {

    private final SalesOutMapper salesOutMapper;
    private final SalesOutDetailMapper salesOutDetailMapper;
    private final OrderNoGenerator orderNoGenerator;
    private final InventoryService inventoryService;

    @Override
    @Transactional
    public SalesOut create(SalesOut salesOut, List<SalesOutDetail> details) {
        // 生成出库单号
        salesOut.setOutNo(orderNoGenerator.generate("SOUT"));
        salesOut.setStatus(CommonStatus.PENDING.getCode());
        salesOutMapper.insert(salesOut);
        
        // 保存明细
        for (SalesOutDetail detail : details) {
            detail.setOutId(salesOut.getId());
            detail.setOutNo(salesOut.getOutNo());
            detail.setCreatedAt(LocalDateTime.now());
        }
        salesOutDetailMapper.batchInsert(details);
        
        log.info("创建销售出库单: {}", salesOut.getOutNo());
        return salesOut;
    }

    @Override
    @Transactional
    public void approve(String id, String userId) {
        SalesOut salesOut = salesOutMapper.selectById(id);
        if (salesOut == null) {
            throw new RuntimeException("出库单不存在: " + id);
        }
        if (salesOut.getStatus() != CommonStatus.PENDING.getCode()) {
            throw new RuntimeException("只有待出库状态可审核");
        }
        
        // 审核时扣减库存
        List<SalesOutDetail> details = salesOutDetailMapper.selectByOutId(id);
        for (SalesOutDetail detail : details) {
            Long productId = Long.parseLong(detail.getProductId());
            Long warehouseId = Long.parseLong(salesOut.getWarehouseId());
            Long locationId = detail.getLocationId() != null ? Long.parseLong(detail.getLocationId()) : null;
            BigDecimal quantity = detail.getQuantity();
            
            boolean reduced = inventoryService.reduceStock(
                productId, 
                warehouseId, 
                locationId, 
                quantity, 
                salesOut.getOutNo(),
                "SALES_OUT",
                Long.parseLong(id)
            );
            if (!reduced) {
                throw new RuntimeException("库存扣减失败: " + detail.getProductName() + " 库存不足");
            }
            log.info("审核扣减库存: 商品{} 数量{}", detail.getProductName(), quantity);
        }
        
        salesOut.setAuditedBy(userId);
        salesOut.setAuditedAt(LocalDateTime.now());
        salesOut.setStatus(CommonStatus.APPROVED.getCode());
        salesOutMapper.update(salesOut);
        log.info("审核销售出库单: {} by {}", id, userId);
    }

    @Override
    @Transactional
    public void cancel(String id, String reason) {
        SalesOut salesOut = salesOutMapper.selectById(id);
        if (salesOut == null) {
            throw new RuntimeException("出库单不存在: " + id);
        }
        if (salesOut.getStatus() == CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成不能取消");
        }
        
        // 如果已审核，需要恢复库存
        if (salesOut.getStatus() == CommonStatus.APPROVED.getCode()) {
            List<SalesOutDetail> details = salesOutDetailMapper.selectByOutId(id);
            for (SalesOutDetail detail : details) {
                Long productId = Long.parseLong(detail.getProductId());
                Long warehouseId = Long.parseLong(salesOut.getWarehouseId());
                Long locationId = detail.getLocationId() != null ? Long.parseLong(detail.getLocationId()) : null;
                BigDecimal quantity = detail.getQuantity();
                
                // 恢复库存 (使用 addStock 退回)
                inventoryService.addStock(
                    productId, 
                    warehouseId, 
                    locationId, 
                    quantity, 
                    detail.getPrice(),
                    salesOut.getOutNo(),
                    "SALES_OUT_CANCEL",
                    Long.parseLong(id)
                );
                log.info("取消恢复库存: 商品{} 数量{}", detail.getProductName(), quantity);
            }
        }
        
        salesOut.setStatus(CommonStatus.CANCELLED.getCode());
        salesOut.setRemark(reason);
        salesOutMapper.update(salesOut);
        log.info("取消销售出库单: {}, 原因: {}", id, reason);
    }

    @Override
    @Transactional
    public void complete(String id) {
        SalesOut salesOut = salesOutMapper.selectById(id);
        if (salesOut == null) {
            throw new RuntimeException("出库单不存在: " + id);
        }
        if (salesOut.getStatus() == CommonStatus.COMPLETED.getCode()) {
            throw new RuntimeException("已完成");
        }
        
        // 扣减库存
        List<SalesOutDetail> details = salesOutDetailMapper.selectByOutId(id);
        for (SalesOutDetail detail : details) {
            Long productId = Long.parseLong(detail.getProductId());
            Long warehouseId = Long.parseLong(salesOut.getWarehouseId());
            Long locationId = detail.getLocationId() != null ? Long.parseLong(detail.getLocationId()) : null;
            BigDecimal quantity = detail.getQuantity();
            
            boolean reduced = inventoryService.reduceStock(
                productId, 
                warehouseId, 
                locationId, 
                quantity, 
                salesOut.getOutNo(),
                "SALES_OUT",
                Long.parseLong(id)
            );
            if (!reduced) {
                throw new RuntimeException("库存扣减失败: " + detail.getProductName() + " 库存不足");
            }
            log.info("扣减库存: 商品{} 数量{}", detail.getProductName(), quantity);
        }
        
        salesOut.setStatus(CommonStatus.COMPLETED.getCode());
        salesOutMapper.update(salesOut);
        log.info("完成销售出库: {}", id);
    }

    @Override
    public SalesOut getById(String id) {
        return salesOutMapper.selectById(id);
    }

    @Override
    public SalesOut getByOutNo(String outNo) {
        return salesOutMapper.selectByOutNo(outNo);
    }

    @Override
    public List<SalesOutDetail> getDetails(String outId) {
        return salesOutDetailMapper.selectByOutId(outId);
    }

    @Override
    public List<SalesOut> list(SalesOut query) {
        return salesOutMapper.selectList(query);
    }

    @Override
    @Transactional
    public void delete(String id) {
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