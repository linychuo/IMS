package com.ims.procurement.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ims.common.util.OrderNoGenerator;
import com.ims.procurement.entity.SupplierPriceAgreement;
import com.ims.procurement.mapper.SupplierPriceAgreementMapper;
import com.ims.procurement.service.SupplierPriceAgreementService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 供应商价格协议服务实现
 */
@Service
public class SupplierPriceAgreementServiceImpl implements SupplierPriceAgreementService {

    private static final Logger log = LoggerFactory.getLogger(SupplierPriceAgreementServiceImpl.class);

    private final SupplierPriceAgreementMapper mapper;
    private final OrderNoGenerator orderNoGenerator;

    public SupplierPriceAgreementServiceImpl(SupplierPriceAgreementMapper mapper,
                                              OrderNoGenerator orderNoGenerator) {
        this.mapper = mapper;
        this.orderNoGenerator = orderNoGenerator;
    }

    @Override
    @Transactional
    public SupplierPriceAgreement create(SupplierPriceAgreement agreement) {
        agreement.setAgreementNo(orderNoGenerator.generateSupplierAgreementNo());
        agreement.setStatus(1);
        mapper.insert(agreement);
        log.info("创建供应商价格协议: {}", agreement.getAgreementNo());
        return agreement;
    }

    @Override
    @Transactional
    public SupplierPriceAgreement update(Long id, SupplierPriceAgreement agreement) {
        SupplierPriceAgreement existing = mapper.selectById(id);
        if (existing == null) {
            throw new RuntimeException("协议不存在: " + id);
        }
        agreement.setId(id);
        mapper.updateById(agreement);
        log.info("更新供应商价格协议: {}", id);
        return agreement;
    }

    @Override
    @Transactional
    public void updateStatus(Long id, Integer status) {
        SupplierPriceAgreement agreement = mapper.selectById(id);
        if (agreement == null) {
            throw new RuntimeException("协议不存在: " + id);
        }
        agreement.setStatus(status);
        mapper.updateById(agreement);
        log.info("更新供应商价格协议状态: {} -> {}", id, status);
    }

    @Override
    public SupplierPriceAgreement getById(Long id) {
        return mapper.selectById(id);
    }

    @Override
    public List<SupplierPriceAgreement> list(SupplierPriceAgreement query) {
        LambdaQueryWrapper<SupplierPriceAgreement> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(query.getSupplierId() != null, SupplierPriceAgreement::getSupplierId, query.getSupplierId())
                .eq(query.getProductId() != null, SupplierPriceAgreement::getProductId, query.getProductId())
                .eq(query.getStatus() != null, SupplierPriceAgreement::getStatus, query.getStatus())
                .orderByDesc(SupplierPriceAgreement::getCreateTime);
        return mapper.selectList(wrapper);
    }

    @Override
    public BigDecimal getPrice(Long supplierId, Long productId, BigDecimal quantity, BigDecimal standardPrice) {
        if (standardPrice == null) {
            return standardPrice;
        }

        // 查询有效协议
        SupplierPriceAgreement agreement = mapper.selectEffective(supplierId, productId);
        if (agreement == null) {
            return standardPrice;
        }

        LocalDate today = LocalDate.now();
        // 检查日期范围
        if (agreement.getStartDate() != null && today.isBefore(agreement.getStartDate())) {
            return standardPrice;
        }
        if (agreement.getEndDate() != null && today.isAfter(agreement.getEndDate())) {
            return standardPrice;
        }

        // 计算价格
        if (agreement.getPriceType() == 1) {
            // 固定价
            return agreement.getStandardPrice();
        } else if (agreement.getPriceType() == 2) {
            // 阶梯价
            return calculateTierPrice(agreement, quantity);
        }

        return standardPrice;
    }

    private BigDecimal calculateTierPrice(SupplierPriceAgreement agreement, BigDecimal quantity) {
        if (quantity == null) {
            return agreement.getStandardPrice();
        }

        // 比较数量区间，返回对应价格
        if (agreement.getTier1Quantity() != null && quantity.compareTo(agreement.getTier1Quantity()) <= 0) {
            return agreement.getTier1Price();
        }
        if (agreement.getTier2Quantity() != null && quantity.compareTo(agreement.getTier2Quantity()) <= 0) {
            return agreement.getTier2Price();
        }
        if (agreement.getTier3Quantity() != null && quantity.compareTo(agreement.getTier3Quantity()) <= 0) {
            return agreement.getTier3Price();
        }

        // 超过最大区间，返回最低价
        if (agreement.getTier3Price() != null) {
            return agreement.getTier3Price();
        }
        if (agreement.getTier2Price() != null) {
            return agreement.getTier2Price();
        }
        if (agreement.getTier1Price() != null) {
            return agreement.getTier1Price();
        }

        return agreement.getStandardPrice();
    }

    @Override
    @Transactional
    public void delete(Long id) {
        SupplierPriceAgreement agreement = mapper.selectById(id);
        if (agreement == null) {
            throw new RuntimeException("协议不存在: " + id);
        }
        if (agreement.getStatus() == 1) {
            throw new RuntimeException("启用状态不可删除");
        }
        mapper.deleteById(id);
        log.info("删除供应商价格协议: {}", id);
    }
}