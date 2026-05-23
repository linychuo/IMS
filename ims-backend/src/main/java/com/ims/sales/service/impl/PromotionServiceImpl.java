package com.ims.sales.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ims.common.util.OrderNoGenerator;
import com.ims.sales.entity.Promotion;
import com.ims.sales.mapper.PromotionMapper;
import com.ims.sales.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 促销活动服务实现
 */
@Service
public class PromotionServiceImpl implements PromotionService {

    @Autowired
    private PromotionMapper promotionMapper;

    @Autowired
    private OrderNoGenerator orderNoGenerator;

    @Override
    public List<Promotion> getActivePromotions() {
        LocalDate today = LocalDate.now();
        LambdaQueryWrapper<Promotion> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Promotion::getStatus, 1)
                .le(Promotion::getStartDate, today)
                .ge(Promotion::getEndDate, today)
                .orderByDesc(Promotion::getCreateTime);
        return promotionMapper.selectList(wrapper);
    }

    @Override
    public Promotion getPromotionByProduct(Long productId, LocalDate date) {
        LocalDate today = date != null ? date : LocalDate.now();
        LambdaQueryWrapper<Promotion> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Promotion::getStatus, 1)
                .le(Promotion::getStartDate, today)
                .ge(Promotion::getEndDate, today)
                .and(w -> w.eq(Promotion::getProductId, productId)
                        .or()
                        .isNull(Promotion::getProductId))
                .orderByDesc(Promotion::getCreateTime)
                .last("LIMIT 1");
        return promotionMapper.selectOne(wrapper);
    }

    @Override
    public Promotion getById(Long id) {
        return promotionMapper.selectById(id);
    }

    @Override
    @Transactional
    public boolean create(Promotion promotion) {
        promotion.setPromotionNo(orderNoGenerator.generatePromotionNo());
        promotion.setCreateTime(LocalDateTime.now());
        promotion.setStatus(1);
        return promotionMapper.insert(promotion) > 0;
    }

    @Override
    @Transactional
    public boolean update(Promotion promotion) {
        promotion.setUpdateTime(LocalDateTime.now());
        return promotionMapper.updateById(promotion) > 0;
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        return promotionMapper.deleteById(id) > 0;
    }

    @Override
    public BigDecimal calculatePromotedPrice(Long productId, BigDecimal originalPrice) {
        Promotion promotion = getPromotionByProduct(productId, LocalDate.now());
        if (promotion == null) {
            return originalPrice;
        }

        BigDecimal promotedPrice = originalPrice;

        switch (promotion.getPromotionType()) {
            case 1: // 折扣促销
                if (promotion.getDiscountType() == 1) { // 折扣率
                    promotedPrice = originalPrice.multiply(promotion.getDiscountValue())
                            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
                } else { // 直接打折
                    promotedPrice = originalPrice.multiply(promotion.getDiscountValue());
                }
                break;
            case 2: // 满减促销
                if (originalPrice.compareTo(promotion.getMinPurchaseAmount()) >= 0) {
                    BigDecimal discount = promotion.getDiscountValue();
                    if (promotion.getMaxDiscountAmount() != null &&
                            discount.compareTo(promotion.getMaxDiscountAmount()) > 0) {
                        discount = promotion.getMaxDiscountAmount();
                    }
                    promotedPrice = originalPrice.subtract(discount);
                    if (promotedPrice.compareTo(BigDecimal.ZERO) < 0) {
                        promotedPrice = BigDecimal.ZERO;
                    }
                }
                break;
            case 3: // 买赠促销 (价格不变，只记录促销信息)
                promotedPrice = originalPrice;
                break;
            case 4: // 限时促销 (直接特价)
                promotedPrice = promotion.getDiscountValue();
                break;
            default:
                promotedPrice = originalPrice;
        }

        return promotedPrice;
    }

    @Override
    public List<Promotion> listAll() {
        LambdaQueryWrapper<Promotion> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByDesc(Promotion::getCreateTime);
        return promotionMapper.selectList(wrapper);
    }
}