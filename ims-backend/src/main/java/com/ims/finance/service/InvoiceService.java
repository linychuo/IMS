package com.ims.finance.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.finance.entity.Invoice;

import com.ims.finance.service.impl.InvoiceServiceImpl.InvoiceStatistics;

import java.util.List;

/**
 * 发票 Service
 */
public interface InvoiceService extends IService<Invoice> {

    /**
     * 根据单据查询发票
     */
    List<Invoice> selectByOrder(String orderType, Long orderId);

    /**
     * 根据供应商查询采购发票
     */
    List<Invoice> selectBySupplier(Long supplierId);

    /**
     * 根据客户查询销售发票
     */
    List<Invoice> selectByCustomer(Long customerId);

    /**
     * 创建发票
     */
    boolean createInvoice(Invoice invoice);

    /**
     * 发票勾选
     */
    boolean checkInvoice(Long id);

    /**
     * 发票报销
     */
    boolean reimburseInvoice(Long id);

    /**
     * 发票作废
     */
    boolean voidInvoice(Long id);

    /**
     * 获取待勾选发票列表（采购）
     */
    List<Invoice> getUncheckedPurchaseInvoices();

    /**
     * 获取待勾选发票列表（销售）
     */
    List<Invoice> getUncheckedSalesInvoices();

    /**
     * 发票统计
     */
    InvoiceStatistics getStatistics();
}