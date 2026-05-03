package com.ims.purchase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.purchase.entity.PurchaseOrder;
import org.apache.ibatis.annotations.Mapper;

/**
 * 采购订单Mapper
 */
@Mapper
public interface PurchaseOrderMapper extends BaseMapper<PurchaseOrder> {
}