package com.ims.purchase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.purchase.entity.PurchaseInItem;
import org.apache.ibatis.annotations.Mapper;

/**
 * 采购入库明细Mapper
 */
@Mapper
public interface PurchaseInItemMapper extends BaseMapper<PurchaseInItem> {
}