package com.ims.sales.mapper;

import com.ims.sales.entity.SalesReturnDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SalesReturnDetailMapper {

    SalesReturnDetail selectById(@Param("id") Long id);

    List<SalesReturnDetail> selectByReturnId(@Param("returnId") Long returnId);

    int batchInsert(@Param("list") List<SalesReturnDetail> details);

    int deleteByReturnId(@Param("returnId") Long returnId);
}