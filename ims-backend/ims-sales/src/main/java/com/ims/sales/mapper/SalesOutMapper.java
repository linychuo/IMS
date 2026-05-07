package com.ims.sales.mapper;

import com.ims.sales.entity.SalesOut;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 销售出库单 Mapper
 */
@Mapper
public interface SalesOutMapper {

    /**
     * 根据ID查询
     */
    SalesOut selectById(@Param("id") String id);

    /**
     * 根据出库单号查询
     */
    SalesOut selectByOutNo(@Param("outNo") String outNo);

    /**
     * 查询列表
     */
    List<SalesOut> selectList(SalesOut query);

    /**
     * 新增
     */
    int insert(SalesOut entity);

    /**
     * 更新
     */
    int update(SalesOut entity);

    /**
     * 删除
     */
    int deleteById(@Param("id") String id);
}