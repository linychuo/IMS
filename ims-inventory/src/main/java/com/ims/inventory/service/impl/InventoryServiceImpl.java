package com.ims.inventory.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.inventory.entity.Inventory;
import com.ims.inventory.entity.InventoryRecord;
import com.ims.inventory.mapper.InventoryMapper;
import com.ims.inventory.mapper.InventoryRecordMapper;
import com.ims.inventory.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 库存台账 Service 实现
 */
@Service
public class InventoryServiceImpl extends ServiceImpl<InventoryMapper, Inventory> implements InventoryService {
    
    @Autowired
    private InventoryRecordMapper recordMapper;

    @Override
    @Transactional
    public boolean addStock(Long productId, Long warehouseId, Long locationId, 
                          BigDecimal quantity, BigDecimal cost,
                          String batchNo, String orderType, Long orderId) {
        // 查询库存台账
        LambdaQueryWrapper<Inventory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Inventory::getProductId, productId)
               .eq(Inventory::getWarehouseId, warehouseId)
               .eq(locationId != null, Inventory::getLocationId, locationId)
               .eq(batchNo != null, Inventory::getBatchNo, batchNo);
        
        Inventory inventory = this.getOne(wrapper);
        
        BigDecimal beforeQuantity = inventory != null ? inventory.getQuantity() : BigDecimal.ZERO;
        
        if (inventory == null) {
            // 新增库存记录
            inventory = new Inventory();
            inventory.setProductId(productId);
            inventory.setWarehouseId(warehouseId);
            inventory.setLocationId(locationId);
            inventory.setQuantity(quantity);
            inventory.setFrozenQuantity(BigDecimal.ZERO);
            inventory.setCost(cost);
            inventory.setBatchNo(batchNo);
            this.save(inventory);
        } else {
            // 更新库存数量
            inventory.setQuantity(inventory.getQuantity().add(quantity));
            this.updateById(inventory);
        }
        
        // 记录库存变动
        recordChange(productId, warehouseId, locationId, "IN", quantity, 
                 beforeQuantity, beforeQuantity.add(quantity), orderType, orderId, batchNo, "入库");
        
        return true;
    }

    @Override
    @Transactional
    public boolean reduceStock(Long productId, Long warehouseId, Long locationId,
                              BigDecimal quantity, String batchNo,
                              String orderType, Long orderId) {
        // 查询库存台账
        LambdaQueryWrapper<Inventory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Inventory::getProductId, productId)
               .eq(Inventory::getWarehouseId, warehouseId);
        
        if (locationId != null) {
            wrapper.eq(Inventory::getLocationId, locationId);
        }
        if (batchNo != null) {
            wrapper.eq(Inventory::getBatchNo, batchNo);
        } else {
            wrapper.isNull(Inventory::getBatchNo);
        }
        
        Inventory inventory = this.getOne(wrapper);
        
        if (inventory == null || inventory.getQuantity().compareTo(quantity) < 0) {
            throw new RuntimeException("库存不足");
        }
        
        BigDecimal beforeQuantity = inventory.getQuantity();
        
        // 检查可用库存是否充足 (库存 - 冻结)
        BigDecimal availableQuantity = inventory.getQuantity().subtract(inventory.getFrozenQuantity());
        if (availableQuantity.compareTo(quantity) < 0) {
            throw new RuntimeException("可用库存不足，已有冻结库存");
        }
        
        // 扣减库存
        inventory.setQuantity(inventory.getQuantity().subtract(quantity));
        this.updateById(inventory);
        
        // 记录库存变动
        recordChange(productId, warehouseId, locationId, "OUT", quantity,
                     beforeQuantity, beforeQuantity.subtract(quantity), orderType, orderId, batchNo, "出库");
        
        return true;
    }

    @Override
    @Transactional
    public boolean freezeStock(Long productId, Long warehouseId, BigDecimal quantity) {
        LambdaQueryWrapper<Inventory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Inventory::getProductId, productId)
               .eq(Inventory::getWarehouseId, warehouseId);
        
        Inventory inventory = this.getOne(wrapper);
        
        if (inventory == null) {
            throw new RuntimeException("库存记录不存在");
        }
        
        // 检查可用库存
        BigDecimal availableQuantity = inventory.getQuantity().subtract(inventory.getFrozenQuantity());
        if (availableQuantity.compareTo(quantity) < 0) {
            throw new RuntimeException("可用库存不足");
        }
        
        BigDecimal beforeFrozen = inventory.getFrozenQuantity();
        
        // 冻结库存
        inventory.setFrozenQuantity(inventory.getFrozenQuantity().add(quantity));
        this.updateById(inventory);
        
        // 记录库存变动
        recordChange(productId, warehouseId, null, "FREEZE", quantity,
                     beforeFrozen, inventory.getFrozenQuantity(), 
                     "FREEZE", null, null, "冻结库存");
        
        return true;
    }

    @Override
    @Transactional
    public boolean unfreezeStock(Long productId, Long warehouseId, BigDecimal quantity) {
        LambdaQueryWrapper<Inventory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Inventory::getProductId, productId)
               .eq(Inventory::getWarehouseId, warehouseId);
        
        Inventory inventory = this.getOne(wrapper);
        
        if (inventory == null) {
            throw new RuntimeException("库存记录不存在");
        }
        
        if (inventory.getFrozenQuantity().compareTo(quantity) < 0) {
            throw new RuntimeException("冻结库存不足");
        }
        
        BigDecimal beforeFrozen = inventory.getFrozenQuantity();
        
        // 解冻库存
        inventory.setFrozenQuantity(inventory.getFrozenQuantity().subtract(quantity));
        this.updateById(inventory);
        
        // 记录库存变动
        recordChange(productId, warehouseId, null, "UNFREEZE", quantity,
                     beforeFrozen, inventory.getFrozenQuantity(),
                     "UNFREEZE", null, null, "解冻库存");
        
        return true;
    }

    @Override
    public BigDecimal getAvailableQuantity(Long productId, Long warehouseId) {
        LambdaQueryWrapper<Inventory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Inventory::getProductId, productId)
               .eq(Inventory::getWarehouseId, warehouseId);
        
        Inventory inventory = this.getOne(wrapper);
        
        if (inventory == null) {
            return BigDecimal.ZERO;
        }
        
        return inventory.getQuantity().subtract(inventory.getFrozenQuantity());
    }
    
    /**
     * 记录库存变动
     */
    private void recordChange(Long productId, Long warehouseId, Long locationId,
                               String changeType, BigDecimal changeQuantity,
                               BigDecimal beforeQuantity, BigDecimal afterQuantity,
                               String orderType, Long orderId, String batchNo, String remark) {
        InventoryRecord record = new InventoryRecord();
        record.setProductId(productId);
        record.setWarehouseId(warehouseId);
        record.setLocationId(locationId);
        record.setChangeType(changeType);
        record.setChangeQuantity(changeQuantity);
        record.setBeforeQuantity(beforeQuantity);
        record.setAfterQuantity(afterQuantity);
        record.setOrderType(orderType);
        record.setOrderId(orderId);
        record.setBatchNo(batchNo);
        record.setRemark(remark);
        record.setCreateTime(LocalDateTime.now());
        
        recordMapper.insert(record);
    }
}