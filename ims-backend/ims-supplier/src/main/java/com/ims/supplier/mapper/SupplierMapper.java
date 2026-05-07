package com.ims.supplier.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.supplier.entity.Supplier;
import org.apache.ibatis.annotations.Mapper;

/**
 * 供应商Mapper
 */
@Mapper
public interface SupplierMapper extends BaseMapper<Supplier> {
}