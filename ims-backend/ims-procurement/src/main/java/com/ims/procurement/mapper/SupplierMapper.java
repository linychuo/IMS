package com.ims.procurement.mapper;

import com.ims.procurement.entity.Supplier;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 供应商 Mapper
 */
@Mapper
public interface SupplierMapper {

    /**
     * 根据ID查询
     */
    Supplier selectById(@Param("id") String id);

    /**
     * 根据供应商编码查询
     */
    Supplier selectByCode(@Param("supplierCode") String supplierCode);

    /**
     * 查询列表
     */
    List<Supplier> selectList(Supplier query);

    /**
     * 新增
     */
    int insert(Supplier entity);

    /**
     * 更新
     */
    int update(Supplier entity);

    /**
     * 删除
     */
    int deleteById(@Param("id") String id);
}