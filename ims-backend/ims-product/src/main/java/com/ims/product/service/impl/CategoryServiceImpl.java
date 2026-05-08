package com.ims.product.service.impl;

import com.ims.product.entity.Category;
import com.ims.product.mapper.CategoryMapper;
import com.ims.product.service.CategoryService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 商品分类服务实现
 */
@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    @Override
    public List<Category> list() {
        return categoryMapper.selectList(null);
    }

    @Override
    public Category getById(Long id) {
        return categoryMapper.selectById(id);
    }

    @Override
    public Category create(Category category) {
        category.setCreateTime(LocalDateTime.now());
        category.setDeleted(0);
        categoryMapper.insert(category);
        return category;
    }

    @Override
    public Category update(Category category) {
        Category exist = categoryMapper.selectById(category.getId());
        if (exist == null) {
            throw new RuntimeException("分类不存在");
        }
        category.setUpdateTime(LocalDateTime.now());
        categoryMapper.updateById(category);
        return categoryMapper.selectById(category.getId());
    }

    @Override
    public void delete(Long id) {
        categoryMapper.deleteById(id);
    }
}