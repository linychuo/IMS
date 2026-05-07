package com.ims.procurement.mapper;

import com.ims.procurement.entity.PurchaseReturn;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 采购退货单 Mapper
 */
@Mapper
public interface PurchaseReturnMapper {

    /**
     * 根据ID查询
     */
    PurchaseReturn selectById(@Param("id") String id);

    /**
     * 根据退货单号查询
     */
    PurchaseReturn selectByReturnNo(@Param("returnNo") String returnNo);

    /**
     * 查询列表
     */
    List<PurchaseReturn> selectList(PurchaseReturn query);

    /**
     * 新增
     */
    int insert(PurchaseReturn entity);

    /**
     * 更新
     */
    int update(PurchaseReturn entity);

    /**
     * 删除
     */
    int deleteById(@Param("id") String id);
}