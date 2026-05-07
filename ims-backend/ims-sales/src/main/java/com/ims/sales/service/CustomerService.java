package com.ims.sales.service;

import com.ims.sales.entity.Customer;

import java.util.List;

/**
 * 客户管理服务接口
 */
public interface CustomerService {

    /**
     * 创建客户
     */
    Customer create(Customer customer);

    /**
     * 更新客户
     */
    Customer update(String id, Customer customer);

    /**
     * 根据ID查询
     */
    Customer getById(String id);

    /**
     * 根据编码查询
     */
    Customer getByCode(String customerCode);

    /**
     * 查询列表
     */
    List<Customer> list(Customer query);

    /**
     * 删除
     */
    void delete(String id);
}