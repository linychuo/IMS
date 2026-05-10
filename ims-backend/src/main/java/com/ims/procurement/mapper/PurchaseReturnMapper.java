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

    PurchaseReturn selectById(@Param("id") Long id);

    PurchaseReturn selectByReturnNo(@Param("returnNo") String returnNo);

    List<PurchaseReturn> selectList(PurchaseReturn query);

    int insert(PurchaseReturn entity);

    int update(PurchaseReturn entity);

    int deleteById(@Param("id") Long id);
}