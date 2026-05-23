package com.ims.procurement.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.procurement.entity.SupplierPriceAgreement;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.List;

/**
 * 供应商价格协议 Mapper
 */
@Mapper
public interface SupplierPriceAgreementMapper extends BaseMapper<SupplierPriceAgreement> {

    /**
     * 根据供应商和商品查询有效协议
     */
    SupplierPriceAgreement selectEffective(@Param("supplierId") Long supplierId, @Param("productId") Long productId);

    /**
     * 根据供应商查询协议列表
     */
    List<SupplierPriceAgreement> selectBySupplier(@Param("supplierId") Long supplierId);
}