package com.ims.product.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.product.entity.UnitOfMeasure;
import com.ims.product.mapper.UnitOfMeasureMapper;
import com.ims.product.service.UnitOfMeasureService;
import org.springframework.stereotype.Service;

/**
 * 计量单位Service实现
 */
@Service
public class UnitOfMeasureServiceImpl extends ServiceImpl<UnitOfMeasureMapper, UnitOfMeasure> implements UnitOfMeasureService {
}
