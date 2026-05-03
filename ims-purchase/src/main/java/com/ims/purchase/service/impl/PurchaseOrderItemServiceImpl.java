package com.ims.purchase.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.purchase.entity.PurchaseOrderItem;
import com.ims.purchase.mapper.PurchaseOrderItemMapper;
import com.ims.purchase.service.PurchaseOrderItemService;
import org.springframework.stereotype.Service;

/**
 * 采购订单明细Service实现
 */
@Service
public class PurchaseOrderItemServiceImpl extends ServiceImpl<PurchaseOrderItemMapper, PurchaseOrderItem> implements PurchaseOrderItemService {
}