package com.ims.product.service;

import com.ims.product.entity.Category;
import java.util.List;

/**
 * 商品分类服务接口
 */
public interface CategoryService {

    List<Category> list();
    Category getById(Long id);
    Category create(Category category);
    Category update(Category category);
    void delete(Long id);
}