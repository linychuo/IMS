package com.ims.inventory.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.core.result.PageResult;
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
    public List<InventoryRecord> selectPage(Long productId, Long warehouseId, String changeType, Long pageSize, Long offset) {
        return baseMapper.selectPage(productId, warehouseId, changeType, pageSize, offset);
    }

    @Override
    public long selectCount(Long productId, Long warehouseId, String changeType) {
        return baseMapper.selectCount(productId, warehouseId, changeType);
    }

    @Override
    public List<InventoryRecord> getByOrder(String orderType, Long orderId) {
        return baseMapper.selectByOrder(orderType, orderId);
    }
}