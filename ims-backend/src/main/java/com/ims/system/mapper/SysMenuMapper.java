package com.ims.system.mapper;

import com.ims.system.entity.SysMenu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SysMenuMapper {

    List<SysMenu> selectAll();

    List<SysMenu> selectAllActive();

    SysMenu selectById(@Param("id") Long id);

    int insert(SysMenu menu);

    int update(SysMenu menu);

    int deleteById(@Param("id") Long id);

    int batchDelete(@Param("ids") List<Long> ids);
}