package com.ims.customer.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.customer.entity.Customer;
import org.apache.ibatis.annotations.Mapper;

/**
 * 客户Mapper
 */
@Mapper
public interface CustomerMapper extends BaseMapper<Customer> {
}