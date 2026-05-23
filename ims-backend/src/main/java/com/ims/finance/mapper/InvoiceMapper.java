package com.ims.finance.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.finance.entity.Invoice;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 发票 Mapper
 */
@Mapper
public interface InvoiceMapper extends BaseMapper<Invoice> {

    /**
     * 根据单据查询发票
     */
    List<Invoice> selectByOrder(@Param("orderType") String orderType, @Param("orderId") Long orderId);

    /**
     * 根据供应商查询采购发票
     */
    List<Invoice> selectBySupplier(@Param("supplierId") Long supplierId);

    /**
     * 根据客户查询销售发票
     */
    List<Invoice> selectByCustomer(@Param("customerId") Long customerId);
}