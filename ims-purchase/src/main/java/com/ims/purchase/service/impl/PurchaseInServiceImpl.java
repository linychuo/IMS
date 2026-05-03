package com.ims.purchase.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.purchase.entity.PurchaseIn;
import com.ims.purchase.entity.PurchaseInItem;
import com.ims.purchase.mapper.PurchaseInMapper;
import com.ims.purchase.service.PurchaseInService;
import com.ims.purchase.service.PurchaseInItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 采购入库Service实现
 */
@Service
public class PurchaseInServiceImpl extends ServiceImpl<PurchaseInMapper, PurchaseIn> implements PurchaseInService {

    @Autowired
    private PurchaseInItemService purchaseInItemService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean auditIn(Long id, String operator) {
        PurchaseIn purchaseIn = getById(id);
        if (purchaseIn == null) {
            throw new RuntimeException("入库单不存在");
        }
        if (purchaseIn.getStatus() != 1) {
            throw new RuntimeException("只有待入库状态可以入库");
        }
        purchaseIn.setStatus(2); // 已入库
        purchaseIn.setOperator(operator);
        
        // TODO: 调用库存服务增加库存
        // inventoryService.addStock(purchaseIn.getWarehouseId(), purchaseIn.getLocationId(), items);
        
        return updateById(purchaseIn);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean cancel(Long id, String reason) {
        PurchaseIn purchaseIn = getById(id);
        if (purchaseIn == null) {
            throw new RuntimeException("入库单不存在");
        }
        if (purchaseIn.getStatus() == 3) {
            throw new RuntimeException("入库单已取消");
        }
        if (purchaseIn.getStatus() == 2) {
            throw new RuntimeException("已入库不能取消");
        }
        purchaseIn.setStatus(3); // 已取消
        purchaseIn.setRemark(reason);
        return updateById(purchaseIn);
    }
}