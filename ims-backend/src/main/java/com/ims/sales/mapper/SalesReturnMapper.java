package com.ims.sales.mapper;

import com.ims.sales.entity.SalesReturn;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 销售退货 Mapper
 */
@Mapper
public interface SalesReturnMapper {

    /**
     * 根据ID查询
     */
    SalesReturn selectById(@Param("id") Long id);

    /**
     * 根据退货单号查询
     */
    SalesReturn selectByReturnNo(@Param("returnNo") String returnNo);

    /**
     * 查询列表
     */
    List<SalesReturn> selectList(SalesReturn query);

    /**
     * 新增
     */
    int insert(SalesReturn entity);

    /**
     * 更新
     */
    int update(SalesReturn entity);

    /**
     * 删除
     */
    int deleteById(@Param("id") Long id);
}