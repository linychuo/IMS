package com.ims.inventory.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.core.dto.PageResult;
import com.ims.inventory.entity.InventoryRecord;
import com.ims.inventory.mapper.InventoryRecordMapper;
import com.ims.inventory.service.InventoryRecordService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 库存变动记录 Service 实现
 */
@Service
public class InventoryRecordServiceImpl extends ServiceImpl<InventoryRecordMapper, InventoryRecord> 
        implements InventoryRecordService {

    @Override
    public PageResult<InventoryRecord> pageRecord(Long page, Long pageSize, Long productId, 
                                                  Long warehouseId, String changeType) {
        LambdaQueryWrapper<InventoryRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(productId != null, InventoryRecord::getProductId, productId)
               .eq(warehouseId != null, InventoryRecord::getWarehouseId, warehouseId)
               .eq(changeType != null, InventoryRecord::getChangeType, changeType)
               .orderByDesc(InventoryRecord::getId);
        
        Page<InventoryRecord> result = this.page(new Page<>(page, pageSize), wrapper);
        return PageResult.of(result);
    }

    @Override
    public List<InventoryRecord> getByOrder(String orderType, Long orderId) {
        return this.list(new LambdaQueryWrapper<InventoryRecord>()
            .eq(InventoryRecord::getOrderType, orderType)
            .eq(InventoryRecord::getOrderId, orderId));
    }
}