package com.ims.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.finance.entity.ExpenseItem;
import org.apache.ibatis.annotations.Mapper;

/**
 * 费用项目 Mapper
 */
@Mapper
public interface ExpenseItemMapper extends BaseMapper<ExpenseItem> {
}