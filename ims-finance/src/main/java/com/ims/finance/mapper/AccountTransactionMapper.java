package com.ims.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.finance.entity.AccountTransaction;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AccountTransactionMapper extends BaseMapper<AccountTransaction> {
}