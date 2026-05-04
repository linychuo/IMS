package com.ims.common.mapper;

import com.ims.common.entity.BaseEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 基础Mapper，所有Mapper继承此类
 * @param <T> 实体类型
 */
@Mapper
public interface BaseMapper<T extends BaseEntity> {
    
    /**
     * 根据ID查询
     */
    T selectById(@Param("id") Long id);
    
    /**
     * 查询列表
     */
    List<T> selectList(@Param("query") T query);
    
    /**
     * 新增
     */
    int insert(@Param("entity") T entity);
    
    /**
     * 更新
     */
    int update(@Param("entity") T entity);
    
    /**
     * 删除（逻辑删除）
     */
    int deleteById(@Param("id") Long id);
}