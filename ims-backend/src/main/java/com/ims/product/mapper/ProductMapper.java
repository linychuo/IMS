package com.ims.product.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.product.entity.Product;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 商品Mapper
 */
@Mapper
public interface ProductMapper extends BaseMapper<Product> {
    Product selectByBarcode(@Param("barcode") String barcode);
}