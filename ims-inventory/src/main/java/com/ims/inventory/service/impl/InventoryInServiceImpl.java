package com.ims.inventory.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.core.dto.PageResult;
import com.ims.inventory.entity.*;
import com.ims.inventory.mapper.InventoryInDetailMapper;
import com.ims.inventory.mapper.InventoryInMapper;
import com.ims.inventory.service.InventoryInService;
import com.ims.inventory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 入库单 Service 实现
 */
@Service
public class InventoryInServiceImpl extends ServiceImpl<InventoryInMapper, InventoryIn> implements InventoryInService {
    
    @Autowired
    private InventoryInDetailMapper inDetailMapper;
    @Autowired
    private InventoryService inventoryService;

    @Override
    public PageResult<InventoryIn> pageIn(Long page, Long pageSize, Long warehouseId, Integer inType, Integer status) {
        LambdaQueryWrapper<InventoryIn> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(warehouseId != null, InventoryIn::getWarehouseId, warehouseId)
               .eq(inType != null, InventoryIn::getInType, inType)
               .eq(status != null, InventoryIn::getStatus, status)
               .orderByDesc(InventoryIn::getId);
        
        Page<InventoryIn> result = this.page(new Page<>(page, pageSize), wrapper);
        return PageResult.of(result);
    }

    @Override
    public InventoryIn getInById(Long id) {
        return this.getById(id);
    }

    @Override
    public List<InventoryInDetail> getInDetails(Long inId) {
        return inDetailMapper.selectList(new LambdaQueryWrapper<InventoryInDetail>()
            .eq(InventoryInDetail::getInId, inId));
    }

    @Override
    public boolean saveIn(InventoryIn in) {
        if (in.getId() == null) {
            in.setInNo(generateInNo());
            in.setInDate(LocalDateTime.now());
            in.setStatus(1);
            return this.save(in);
        }
        return this.updateById(in);
    }

    @Override
    @Transactional
    public boolean saveInWithDetails(InventoryIn in, List<InventoryInDetail> details) {
        if (in.getId() == null) {
            in.setInNo(generateInNo());
            in.setInDate(LocalDateTime.now());
            in.setStatus(1);
            this.save(in);
            
            BigDecimal total = BigDecimal.ZERO;
            for (InventoryInDetail detail : details) {
                detail.setInId(in.getId());
                detail.setAmount(detail.getPrice().multiply(detail.getQuantity()));
                inDetailMapper.insert(detail);
                total = total.add(detail.getAmount());
            }
            in.setTotalAmount(total);
            this.updateById(in);
        }
        return true;
    }

    @Override
    @Transactional
    public boolean auditIn(Long id, Long auditorId) {
        InventoryIn in = this.getById(id);
        if (in == null || in.getStatus() != 1) {
            return false;
        }
        
        // 获取入库明细
        List<InventoryInDetail> details = getInDetails(id);
        
        // 增加库存
        for (InventoryInDetail detail : details) {
            inventoryService.addStock(
                detail.getProductId(),
                in.getWarehouseId(),
                detail.getLocationId(),
                detail.getQuantity(),
                detail.getPrice(),
                detail.getBatchNo(),
                "INVENTORY_IN",
                id
            );
        }
        
        // 更新状态
        in.setStatus(2);
        in.setAuditorId(auditorId);
        in.setAuditTime(LocalDateTime.now());
        
        return this.updateById(in);
    }

    @Override
    @Transactional
    public boolean cancelIn(Long id) {
        InventoryIn in = this.getById(id);
        if (in == null || in.getStatus() != 1) {
            return false;
        }
        
        in.setStatus(3);
        return this.updateById(in);
    }
    
    private String generateInNo() {
        return "INI" + System.currentTimeMillis();
    }
}