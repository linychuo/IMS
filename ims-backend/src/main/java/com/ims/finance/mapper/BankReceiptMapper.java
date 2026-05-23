package com.ims.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.finance.entity.BankReceipt;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 银行收款认领 Mapper
 */
@Mapper
public interface BankReceiptMapper extends BaseMapper<BankReceipt> {

    /**
     * 根据客户查询待认领收款
     */
    List<BankReceipt> selectPendingByCustomer(@Param("customerId") Long customerId);

    /**
     * 查询所有待认领收款
     */
    List<BankReceipt> selectAllPending();
}