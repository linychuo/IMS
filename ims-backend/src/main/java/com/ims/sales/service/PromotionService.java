package com.ims.sales.service;

import com.ims.sales.entity.Promotion;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 促销活动服务接口
 */
public interface PromotionService {

    /**
     * 获取所有有效促销活动
     */
    List<Promotion> getActivePromotions();

    /**
     * 根据商品获取有效的促销活动
     */
    Promotion getPromotionByProduct(Long productId, LocalDate date);

    /**
     * 获取促销活动详情
     */
    Promotion getById(Long id);

    /**
     * 创建促销活动
     */
    boolean create(Promotion promotion);

    /**
     * 更新促销活动
     */
    boolean update(Promotion promotion);

    /**
     * 删除促销活动
     */
    boolean delete(Long id);

    /**
     * 计算促销价格
     */
    BigDecimal calculatePromotedPrice(Long productId, BigDecimal originalPrice);

    /**
     * 获取所有促销活动
     */
    List<Promotion> listAll();
}