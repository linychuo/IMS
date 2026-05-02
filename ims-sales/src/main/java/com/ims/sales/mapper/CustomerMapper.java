package com.ims.sales.mapper;

import com.ims.sales.entity.Customer;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 客户 Mapper
 */
@Mapper
public interface CustomerMapper {

    /**
     * 根据ID查询
     */
    Customer selectById(@Param("id") String id);

    /**
     * 根据客户编码查询
     */
    Customer selectByCode(@Param("customerCode") String customerCode);

    /**
     * 查询列表
     */
    List<Customer> selectList(Customer query);

    /**
     * 新增
     */
    int insert(Customer entity);

    /**
     * 更新
     */
    int update(Customer entity);

    /**
     * 删除
     */
    int deleteById(@Param("id") String id);
}