package com.ims.sales.mapper;

import com.ims.sales.entity.SalesOutDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 销售出库明细 Mapper
 */
@Mapper
public interface SalesOutDetailMapper {

    /**
     * 根据ID查询
     */
    SalesOutDetail selectById(@Param("id") String id);

    /**
     * 根据出库单ID查询明细
     */
    List<SalesOutDetail> selectByOutId(@Param("outId") String outId);

    /**
     * 根据出库单号查询明细
     */
    List<SalesOutDetail> selectByOutNo(@Param("outNo") String outNo);

    /**
     * 新增
     */
    int insert(SalesOutDetail entity);

    /**
     * 批量新增
     */
    int batchInsert(List<SalesOutDetail> entities);

    /**
     * 删除
     */
    int deleteByOutId(@Param("outId") String outId);
}