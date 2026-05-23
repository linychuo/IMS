package com.ims.procurement.service;

import com.ims.procurement.entity.SupplierPriceAgreement;

import java.math.BigDecimal;
import java.util.List;

/**
 * 供应商价格协议服务接口
 */
public interface SupplierPriceAgreementService {

    /**
     * 创建协议
     */
    SupplierPriceAgreement create(SupplierPriceAgreement agreement);

    /**
     * 更新协议
     */
    SupplierPriceAgreement update(Long id, SupplierPriceAgreement agreement);

    /**
     * 启用/禁用
     */
    void updateStatus(Long id, Integer status);

    /**
     * 根据ID查询
     */
    SupplierPriceAgreement getById(Long id);

    /**
     * 查询列表
     */
    List<SupplierPriceAgreement> list(SupplierPriceAgreement query);

    /**
     * 获取采购价格（根据数量和协议计算阶梯价）
     */
    BigDecimal getPrice(Long supplierId, Long productId, BigDecimal quantity, BigDecimal standardPrice);

    /**
     * 删除
     */
    void delete(Long id);
}