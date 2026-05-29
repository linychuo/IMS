package com.ims.inventory.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.inventory.entity.Inventory;
import com.ims.inventory.entity.InventoryRecord;
import com.ims.inventory.mapper.InventoryMapper;
import com.ims.inventory.mapper.InventoryRecordMapper;
import com.ims.inventory.service.InventoryService;
import com.ims.product.entity.Product;
import com.ims.product.mapper.ProductMapper;
import com.ims.system.service.SysConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 库存台账 Service 实现
 */
@Service
public class InventoryServiceImpl extends ServiceImpl<InventoryMapper, Inventory> implements InventoryService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(InventoryServiceImpl.class);

    @Autowired
    private InventoryRecordMapper recordMapper;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private SysConfigService sysConfigService;

    @Override
    public List<Inventory> selectPage(Long productId, Long warehouseId, Long pageSize, Long offset) {
        return baseMapper.selectPage(productId, warehouseId, pageSize, offset);
    }

    @Override
    public long selectCount(Long productId, Long warehouseId) {
        return baseMapper.selectCount(productId, warehouseId);
    }

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
    public BigDecimal reduceStock(Long productId, Long warehouseId, Long locationId,
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

        // 检查是否允许负库存
        String allowNegative = sysConfigService.getValue("inventory.allowNegativeStock", "false");
        boolean allowNegativeStock = "true".equalsIgnoreCase(allowNegative);

        if (inventory == null) {
            if (!allowNegativeStock) {
                throw new RuntimeException("库存不足");
            }
            // 允许负库存时，创建新记录（数量为负）
            inventory = new Inventory();
            inventory.setProductId(productId);
            inventory.setWarehouseId(warehouseId);
            inventory.setLocationId(locationId);
            inventory.setQuantity(quantity.negate()); // 负数
            inventory.setFrozenQuantity(BigDecimal.ZERO);
            inventory.setBatchNo(batchNo);
            this.save(inventory);
            recordChange(productId, warehouseId, locationId, "OUT", quantity,
                    BigDecimal.ZERO, quantity.negate(), orderType, orderId, batchNo, "出库(负库存)");
            return BigDecimal.ZERO; // 负库存无法确定成本
        }

        BigDecimal beforeQuantity = inventory.getQuantity();

        // 检查可用库存是否充足 (库存 - 冻结)
        BigDecimal availableQuantity = inventory.getQuantity().subtract(inventory.getFrozenQuantity());
        if (availableQuantity.compareTo(quantity) < 0) {
            if (!allowNegativeStock && availableQuantity.compareTo(BigDecimal.ZERO) < 0) {
                throw new RuntimeException("可用库存不足，已有冻结库存");
            }
            if (!allowNegativeStock && availableQuantity.compareTo(quantity) < 0) {
                throw new RuntimeException("可用库存不足，已有冻结库存");
            }
        }

        // 扣减库存
        inventory.setQuantity(inventory.getQuantity().subtract(quantity));
        this.updateById(inventory);

        // 记录库存变动
        recordChange(productId, warehouseId, locationId, "OUT", quantity,
                     beforeQuantity, beforeQuantity.subtract(quantity), orderType, orderId, batchNo, "出库");

        // 返回该批次的单位成本
        return inventory.getCost();
    }

    @Override
    @Transactional
    public BigDecimal reduceStockByFifo(Long productId, Long warehouseId, Long locationId,
                                      BigDecimal quantity, String batchNo,
                                      String orderType, Long orderId) {
        // 检查是否允许负库存
        String allowNegative = sysConfigService.getValue("inventory.allowNegativeStock", "false");
        boolean allowNegativeStock = "true".equalsIgnoreCase(allowNegative);

        // 如果指定了批次，按指定批次扣减
        if (batchNo != null && !batchNo.isEmpty()) {
            return reduceStock(productId, warehouseId, locationId, quantity, batchNo, orderType, orderId);
        }

        // FIFO模式：按生产日期升序选择批次
        LambdaQueryWrapper<Inventory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Inventory::getProductId, productId)
               .eq(Inventory::getWarehouseId, warehouseId);

        // 如果不允许负库存，只选有可用库存的批次
        if (!allowNegativeStock) {
            wrapper.gt(Inventory::getQuantity, BigDecimal.ZERO);
        }

        // 按生产日期升序，最早的生产日期排前面
        wrapper.orderByAsc(Inventory::getProductionDate)
               .orderByAsc(Inventory::getCreateTime);

        List<Inventory> inventoryList = this.list(wrapper);

        if (inventoryList.isEmpty() && !allowNegativeStock) {
            throw new RuntimeException("库存不足，没有可用批次");
        }

        if (inventoryList.isEmpty() && allowNegativeStock) {
            // 允许负库存时，创建负库存记录
            addStock(productId, warehouseId, locationId, quantity.negate(), BigDecimal.ZERO, batchNo, orderType, orderId);
            return BigDecimal.ZERO;
        }

        // 按FIFO顺序扣减，计算加权平均成本
        BigDecimal remainingQuantity = quantity;
        BigDecimal totalCost = BigDecimal.ZERO;
        BigDecimal totalQuantity = BigDecimal.ZERO;

        for (Inventory inventory : inventoryList) {
            if (remainingQuantity.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            BigDecimal availableQty = inventory.getQuantity().subtract(inventory.getFrozenQuantity());
            if (availableQty.compareTo(BigDecimal.ZERO) <= 0) {
                continue; // 跳过没有可用库存的批次
            }

            BigDecimal deductQty = availableQty.compareTo(remainingQuantity) >= 0
                    ? remainingQuantity : availableQty;

            BigDecimal beforeQuantity = inventory.getQuantity();
            inventory.setQuantity(inventory.getQuantity().subtract(deductQty));
            this.updateById(inventory);

            // 累计成本：批次成本 × 扣减数量
            if (inventory.getCost() != null) {
                totalCost = totalCost.add(inventory.getCost().multiply(deductQty));
                totalQuantity = totalQuantity.add(deductQty);
            }

            // 记录库存变动
            recordChange(productId, warehouseId, inventory.getLocationId(), "OUT", deductQty,
                         beforeQuantity, beforeQuantity.subtract(deductQty), orderType, orderId,
                         inventory.getBatchNo(), "FIFO出库");

            log.info("FIFO扣减: 批次{} 商品{} 数量{} 剩余库存{}",
                     inventory.getBatchNo(), productId, deductQty, inventory.getQuantity());

            remainingQuantity = remainingQuantity.subtract(deductQty);
        }

        if (remainingQuantity.compareTo(BigDecimal.ZERO) > 0) {
            throw new RuntimeException("库存不足，无法完成FIFO扣减，缺少: " + remainingQuantity);
        }

        // 返回加权平均单位成本
        if (totalQuantity.compareTo(BigDecimal.ZERO) > 0) {
            return totalCost.divide(totalQuantity, 2, RoundingMode.HALF_UP);
        }
        return BigDecimal.ZERO;
    }

    @Override
    public List<Inventory> getInventoryListByProduct(Long productId, Long warehouseId) {
        LambdaQueryWrapper<Inventory> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Inventory::getProductId, productId)
               .eq(warehouseId != null, Inventory::getWarehouseId, warehouseId)
               .gt(Inventory::getQuantity, BigDecimal.ZERO);

        // 按生产日期升序，用于FIFO推荐
        wrapper.orderByAsc(Inventory::getProductionDate)
               .orderByAsc(Inventory::getCreateTime);

        return this.list(wrapper);
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

    @Override
    public List<Inventory> getWarningList() {
        // 查询所有库存记录
        List<Inventory> inventories = this.list();

        // 获取商品的安全库存阈值
        return inventories.stream()
            .filter(inv -> {
                Product product = productMapper.selectById(inv.getProductId());
                if (product == null || product.getStockWarning() == null) {
                    return false;
                }
                BigDecimal available = inv.getQuantity().subtract(inv.getFrozenQuantity());
                return available.compareTo(BigDecimal.valueOf(product.getStockWarning())) < 0;
            })
            .map(inv -> {
                Product product = productMapper.selectById(inv.getProductId());
                inv.setProductName(product != null ? product.getName() : null);
                inv.setProductCode(product != null ? product.getCode() : null);
                return inv;
            })
            .toList();
    }

    @Override
    public List<Inventory> getExpiringList(Integer days) {
        if (days == null) {
            days = 30; // 默认30天
        }
        LocalDate threshold = LocalDate.now().plusDays(days);
        LambdaQueryWrapper<Inventory> wrapper = new LambdaQueryWrapper<>();
        wrapper.isNotNull(Inventory::getExpiryDate)
              .le(Inventory::getExpiryDate, threshold)
              .gt(Inventory::getQuantity, BigDecimal.ZERO);
        return this.list(wrapper);
    }

    @Override
    public List<Inventory> getIdleStock(Integer days) {
        if (days == null) {
            days = 90; // 默认90天
        }
        // 查询最近days天没有出入库的商品
        LocalDate threshold = LocalDate.now().minusDays(days);
        // 通过InventoryRecord查找最后变动日期
        List<Inventory> inventories = this.list();
        return inventories.stream()
            .filter(inv -> {
                // 检查是否有在threshold之后的变化记录
                LambdaQueryWrapper<InventoryRecord> wrapper = new LambdaQueryWrapper<>();
                wrapper.eq(InventoryRecord::getProductId, inv.getProductId())
                       .ge(InventoryRecord::getCreateTime, threshold.atStartOfDay());
                long count = recordMapper.selectCount(wrapper);
                return count == 0 && inv.getQuantity().compareTo(BigDecimal.ZERO) > 0;
            })
            .toList();
    }

    @Override
    public List<Inventory> getHighStockList() {
        List<Inventory> inventories = this.list();
        return inventories.stream()
            .filter(inv -> {
                if (inv.getHighStockWarning() == null) {
                    return false;
                }
                BigDecimal available = inv.getQuantity().subtract(inv.getFrozenQuantity());
                return available.compareTo(inv.getHighStockWarning()) > 0;
            })
            .map(inv -> {
                var product = productMapper.selectById(inv.getProductId());
                inv.setProductName(product != null ? product.getName() : null);
                inv.setProductCode(product != null ? product.getCode() : null);
                return inv;
            })
            .toList();
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
        record.setCreateTime(LocalDateTime.now());
        
        recordMapper.insert(record);
    }
}