package com.ims.sales.service.impl;

import com.ims.sales.entity.Customer;
import com.ims.sales.mapper.CustomerMapper;
import com.ims.sales.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 客户管理服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerMapper customerMapper;

    @Override
    @Transactional
    public Customer create(Customer customer) {
        // 检查编码是否重复
        Customer existing = customerMapper.selectByCode(customer.getCustomerCode());
        if (existing != null) {
            throw new RuntimeException("客户编码已存在: " + customer.getCustomerCode());
        }
        customer.setCreatedAt(LocalDateTime.now());
        customerMapper.insert(customer);
        log.info("创建客户: {}", customer.getCustomerName());
        return customer;
    }

    @Override
    @Transactional
    public Customer update(String id, Customer customer) {
        Customer existing = customerMapper.selectById(id);
        if (existing == null) {
            throw new RuntimeException("客户不存在: " + id);
        }
        customer.setId(id);
        customer.setUpdatedAt(LocalDateTime.now());
        customerMapper.update(customer);
        log.info("更新客户: {}", id);
        return customer;
    }

    @Override
    public Customer getById(String id) {
        return customerMapper.selectById(id);
    }

    @Override
    public Customer getByCode(String customerCode) {
        return customerMapper.selectByCode(customerCode);
    }

    @Override
    public List<Customer> list(Customer query) {
        return customerMapper.selectList(query);
    }

    @Override
    @Transactional
    public void delete(String id) {
        Customer customer = customerMapper.selectById(id);
        if (customer == null) {
            throw new RuntimeException("客户不存在: " + id);
        }
        customerMapper.deleteById(id);
        log.info("删除客户: {}", id);
    }
}