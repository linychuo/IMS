package com.ims.purchase.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.purchase.entity.PurchaseIn;
import org.apache.ibatis.annotations.Mapper;

/**
 * 采购入库单Mapper
 */
@Mapper
public interface PurchaseInMapper extends BaseMapper<PurchaseIn> {
}