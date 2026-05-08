package com.ims.product.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.product.entity.Category;
import org.apache.ibatis.annotations.Mapper;

/**
 * 商品分类Mapper
 */
@Mapper
public interface CategoryMapper extends BaseMapper<Category> {
}