package com.ims.procurement.mapper;

import com.ims.procurement.entity.Supplier;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 供应商Mapper
 */
@Mapper
public interface SupplierMapper {

    Supplier selectById(@Param("id") Long id);

    Supplier selectByCode(@Param("supplierCode") String supplierCode);

    List<Supplier> selectList(Supplier query);

    int insert(Supplier entity);

    int update(Supplier entity);

    int deleteById(@Param("id") Long id);
}