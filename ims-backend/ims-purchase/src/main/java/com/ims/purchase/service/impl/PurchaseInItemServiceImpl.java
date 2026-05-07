package com.ims.purchase.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.purchase.entity.PurchaseInItem;
import com.ims.purchase.mapper.PurchaseInItemMapper;
import com.ims.purchase.service.PurchaseInItemService;
import org.springframework.stereotype.Service;

/**
 * 采购入库明细Service实现
 */
@Service
public class PurchaseInItemServiceImpl extends ServiceImpl<PurchaseInItemMapper, PurchaseInItem> implements PurchaseInItemService {
}