package com.ims.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.finance.entity.Expense;
import org.apache.ibatis.annotations.Mapper;

/**
 * 费用 Mapper
 */
@Mapper
public interface ExpenseMapper extends BaseMapper<Expense> {
}