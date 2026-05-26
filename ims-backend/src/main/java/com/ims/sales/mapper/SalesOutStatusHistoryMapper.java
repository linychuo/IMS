package com.ims.sales.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.sales.entity.SalesOutStatusHistory;
import org.apache.ibatis.annotations.Mapper;

/**
 * 销售出库状态历史 Mapper
 */
@Mapper
public interface SalesOutStatusHistoryMapper extends BaseMapper<SalesOutStatusHistory> {
}