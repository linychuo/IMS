package com.ims.procurement.mapper;

import com.ims.procurement.entity.PurchaseReturnDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 采购退货明细 Mapper
 */
@Mapper
public interface PurchaseReturnDetailMapper {

    List<PurchaseReturnDetail> selectByReturnId(@Param("returnId") Long returnId);

    int batchInsert(@Param("list") List<PurchaseReturnDetail> details);

    int deleteByReturnId(@Param("returnId") Long returnId);
}