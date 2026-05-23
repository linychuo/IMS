package com.ims.inventory.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.core.result.PageResult;
import com.ims.inventory.entity.InventoryOut;
import com.ims.inventory.entity.InventoryOutDetail;
import com.ims.inventory.mapper.InventoryOutDetailMapper;
import com.ims.inventory.mapper.InventoryOutMapper;
import com.ims.inventory.service.InventoryOutService;
import com.ims.inventory.service.InventoryService;
import com.ims.product.entity.Product;
import com.ims.product.mapper.ProductMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 出库单 Service 实现
 */
@Service
public class InventoryOutServiceImpl extends ServiceImpl<InventoryOutMapper, InventoryOut> implements InventoryOutService {
    
    @Autowired
    private InventoryOutDetailMapper outDetailMapper;
    @Autowired
    private InventoryService inventoryService;
    @Autowired
    private ProductMapper productMapper;

    @Override
    public PageResult<InventoryOut> pageOut(Long page, Long pageSize, Long warehouseId, Integer outType, Integer status) {
        Long offset = (page - 1) * pageSize;
        List<InventoryOut> records = baseMapper.selectPage(warehouseId, outType, status, pageSize, offset);
        long total = baseMapper.selectCount(warehouseId, outType, status);
        return PageResult.build(records, total, page, pageSize);
    }

    @Override
    public InventoryOut getOutById(Long id) {
        return this.getById(id);
    }

    @Override
    public List<InventoryOutDetail> getOutDetails(Long outId) {
        return outDetailMapper.selectList(new LambdaQueryWrapper<InventoryOutDetail>()
            .eq(InventoryOutDetail::getOutId, outId));
    }

    @Override
    public boolean saveOut(InventoryOut out) {
        if (out.getId() == null) {
            out.setOutNo(generateOutNo());
            out.setOutDate(LocalDateTime.now());
            out.setStatus(1);
            return this.save(out);
        }
        return this.updateById(out);
    }

    @Override
    @Transactional
    public boolean saveOutWithDetails(InventoryOut out, List<InventoryOutDetail> details) {
        if (out.getId() == null) {
            out.setOutNo(generateOutNo());
            out.setOutDate(LocalDateTime.now());
            out.setStatus(1);
            this.save(out);
            
            BigDecimal total = BigDecimal.ZERO;
            for (InventoryOutDetail detail : details) {
                detail.setOutId(out.getId());
                detail.setAmount(detail.getPrice().multiply(detail.getQuantity()));
                outDetailMapper.insert(detail);
                total = total.add(detail.getAmount());
            }
            out.setTotalAmount(total);
            this.updateById(out);
        }
        return true;
    }

    @Override
    @Transactional
    public boolean auditOut(Long id, Long auditorId) {
        InventoryOut out = this.getById(id);
        if (out == null || out.getStatus() != 1) {
            return false;
        }

        // 获取出库明细
        List<InventoryOutDetail> details = getOutDetails(id);

        // 扣减库存 - 使用FIFO自动选择批次
        for (InventoryOutDetail detail : details) {
            inventoryService.reduceStockByFifo(
                detail.getProductId(),
                out.getWarehouseId(),
                detail.getLocationId(),
                detail.getQuantity(),
                detail.getBatchNo(), // 如果有批次号则用指定批次，否则FIFO
                "INVENTORY_OUT",
                id
            );
        }

        // 更新状态
        out.setStatus(2);
        out.setAuditedBy(String.valueOf(auditorId));
        out.setAuditedAt(LocalDateTime.now());

        return this.updateById(out);
    }

    @Override
    @Transactional
    public boolean cancelOut(Long id) {
        InventoryOut out = this.getById(id);
        if (out == null || out.getStatus() != 1) {
            return false;
        }
        
        out.setStatus(3);
        return this.updateById(out);
    }
    
    private String generateOutNo() {
        return "OUT" + System.currentTimeMillis();
    }

    @Override
    public InventoryOutDetail getByBarcode(String barcode) {
        Product product = productMapper.selectByBarcode(barcode);
        if (product == null) {
            throw new RuntimeException("商品不存在，条码：" + barcode);
        }

        InventoryOutDetail detail = new InventoryOutDetail();
        detail.setProductId(product.getId());
        detail.setProductName(product.getName());
        detail.setProductCode(product.getCode());
        detail.setUnit(product.getUnit());
        detail.setSpec(product.getSpec());
        detail.setPrice(product.getSalePrice());
        detail.setBarcode(barcode);
        return detail;
    }
}