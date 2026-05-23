package com.ims.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.finance.entity.CustomerReconciliation;
import org.apache.ibatis.annotations.Mapper;

/**
 * 客户对账 Mapper
 */
@Mapper
public interface CustomerReconciliationMapper extends BaseMapper<CustomerReconciliation> {
}