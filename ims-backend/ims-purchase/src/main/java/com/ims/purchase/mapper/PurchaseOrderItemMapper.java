package com.ims.purchase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.purchase.entity.PurchaseOrderItem;
import org.apache.ibatis.annotations.Mapper;

/**
 * 采购订单明细Mapper
 */
@Mapper
public interface PurchaseOrderItemMapper extends BaseMapper<PurchaseOrderItem> {
}