package com.ims.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.finance.entity.Account;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AccountMapper extends BaseMapper<Account> {
}