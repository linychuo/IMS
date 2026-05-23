package com.ims.system.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.ims.system.entity.SysUserWarehouse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 用户仓库权限Mapper
 */
@Mapper
public interface SysUserWarehouseMapper extends BaseMapper<SysUserWarehouse> {

    /**
     * 查询用户可访问的仓库ID列表
     */
    List<Long> selectWarehouseIdsByUserId(@Param("userId") Long userId);

    /**
     * 删除用户仓库权限
     */
    int deleteByUserId(@Param("userId") Long userId);
}