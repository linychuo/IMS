package com.ims.sales.mapper;

import com.ims.sales.entity.SalesOutDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SalesOutDetailMapper {

    SalesOutDetail selectById(@Param("id") Long id);

    List<SalesOutDetail> selectByOutId(@Param("outId") Long outId);

    List<SalesOutDetail> selectByOutNo(@Param("outNo") String outNo);

    int insert(SalesOutDetail entity);

    int batchInsert(List<SalesOutDetail> entities);

    int deleteByOutId(@Param("outId") Long outId);
}