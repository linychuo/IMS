package com.ims.inventory.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.ims.core.result.PageResult;
import com.ims.inventory.entity.QualityCheck;
import com.ims.inventory.entity.QualityCheckDetail;

import java.math.BigDecimal;
import java.util.List;

/**
 * 质检单 Service 接口
 */
public interface QualityCheckService extends IService<QualityCheck> {

    /**
     * 分页查询
     */
    PageResult<QualityCheck> page(Long page, Long pageSize, String orderType, Integer status);

    /**
     * 根据ID查询
     */
    QualityCheck getById(Long id);

    /**
     * 创建质检单
     */
    QualityCheck create(QualityCheck check, List<QualityCheckDetail> details);

    /**
     * 更新质检结果
     */
    boolean updateResult(Long id, String checkResult, BigDecimal qualifiedQty, BigDecimal unqualifiedQty, String remark);

    /**
     * 提交质检结果
     */
    boolean submit(Long id, Long inspectorId, String inspectorName);

    /**
     * 取消质检
     */
    boolean cancel(Long id, String reason);

    /**
     * 获取质检明细
     */
    List<QualityCheckDetail> getDetails(Long checkId);
}