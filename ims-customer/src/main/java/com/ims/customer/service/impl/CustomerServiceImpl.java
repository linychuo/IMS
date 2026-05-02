package com.ims.customer.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.customer.entity.Customer;
import com.ims.customer.mapper.CustomerMapper;
import com.ims.customer.service.CustomerService;
import org.springframework.stereotype.Service;

/**
 * 客户Service实现
 */
@Service
public class CustomerServiceImpl extends ServiceImpl<CustomerMapper, Customer> implements CustomerService {
}