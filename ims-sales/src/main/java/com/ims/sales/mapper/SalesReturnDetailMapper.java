package com.ims.sales.mapper;

import com.ims.sales.entity.SalesReturnDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 销售退货明细 Mapper
 */
@Mapper
public interface SalesReturnDetailMapper {

    /**
     * 根据ID查询
     */
    SalesReturnDetail selectById(@Param("id") String id);

    /**
     * 根据退货单ID查询明细
     */
    List<SalesReturnDetail> selectByReturnId(@Param("returnId") String returnId);

    /**
     * 批量新增
     */
    int batchInsert(@Param("list") List<SalesReturnDetail> details);

    /**
     * 删除
     */
    int deleteByReturnId(@Param("returnId") String returnId);
}