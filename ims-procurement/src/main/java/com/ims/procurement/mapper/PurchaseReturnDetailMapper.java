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

    /**
     * 根据退货单ID查询明细
     */
    List<PurchaseReturnDetail> selectByReturnId(@Param("returnId") String returnId);

    /**
     * 批量插入
     */
    int batchInsert(@Param("list") List<PurchaseReturnDetail> details);

    /**
     * 删除
     */
    int deleteByReturnId(@Param("returnId") String returnId);
}