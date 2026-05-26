package com.ims.sales.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.sales.entity.SalesReturnStatusHistory;
import org.apache.ibatis.annotations.Mapper;

/**
 * 销售退货状态历史 Mapper
 */
@Mapper
public interface SalesReturnStatusHistoryMapper extends BaseMapper<SalesReturnStatusHistory> {
}