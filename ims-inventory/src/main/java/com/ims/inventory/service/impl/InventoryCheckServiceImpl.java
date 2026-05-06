package com.ims.inventory.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.core.result.PageResult;
import com.ims.inventory.entity.Inventory;
import com.ims.inventory.entity.InventoryCheck;
import com.ims.inventory.entity.InventoryCheckDetail;
import com.ims.inventory.entity.InventoryRecord;
import com.ims.inventory.mapper.InventoryCheckDetailMapper;
import com.ims.inventory.mapper.InventoryCheckMapper;
import com.ims.inventory.mapper.InventoryMapper;
import com.ims.inventory.mapper.InventoryRecordMapper;
import com.ims.inventory.service.InventoryCheckService;
import com.ims.inventory.service.InventoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 库存盘点 Service 实现
 */
@Service
public class InventoryCheckServiceImpl extends ServiceImpl<InventoryCheckMapper, InventoryCheck> implements InventoryCheckService {

    private static final Logger log = LoggerFactory.getLogger(InventoryCheckServiceImpl.class);

    @Autowired
    private InventoryCheckMapper inventoryCheckMapper;
    @Autowired
    private InventoryCheckDetailMapper inventoryCheckDetailMapper;
    @Autowired
    private InventoryMapper inventoryMapper;
    @Autowired
    private InventoryRecordMapper inventoryRecordMapper;
    @Autowired
    private InventoryService inventoryService;

    @Override
    public PageResult<InventoryCheck> page(Long page, Long pageSize, Long warehouseId, Integer status) {
        LambdaQueryWrapper<InventoryCheck> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(warehouseId != null, InventoryCheck::getWarehouseId, warehouseId)
              .eq(status != null, InventoryCheck::getStatus, status)
              .orderByDesc(InventoryCheck::getId);
        Page<InventoryCheck> result = this.page(new Page<>(page, pageSize), wrapper);
        return PageResult.of(result);
    }

    @Override
    public InventoryCheck getById(Long id) {
        return this.getById(id);
    }

    @Override
    @Transactional
    public InventoryCheck create(InventoryCheck check, List<InventoryCheckDetail> details) {
        // 生成盘点单号
        check.setCheckNo("CK" + System.currentTimeMillis());
        check.setStatus(0); // 待盘点
        check.setCreateTime(LocalDateTime.now());
        inventoryCheckMapper.insert(check);

        // 保存明细
        for (InventoryCheckDetail detail : details) {
            detail.setCheckId(check.getId());
            detail.setCheckNo(check.getCheckNo());
            detail.setCreateTime(LocalDateTime.now());
            // 计算差异
            if (detail.getSystemQty() != null && detail.getActualQty() != null) {
                detail.setDiffQty(detail.getActualQty().subtract(detail.getSystemQty()));
            }
            inventoryCheckDetailMapper.insert(detail);
        }

        log.info("创建库存盘点单: {}", check.getCheckNo());
        return check;
    }

    @Override
    @Transactional
    public boolean startCheck(Long id, Long checkerId) {
        InventoryCheck check = this.getById(id);
        if (check == null || check.getStatus() != 0) {
            return false;
        }
        check.setStatus(1); // 盘点中
        check.setCheckerId(checkerId);
        check.setCheckTime(LocalDateTime.now());
        return this.updateById(check);
    }

    @Override
    @Transactional
    public boolean submitResult(Long id, List<InventoryCheckDetail> details) {
        for (InventoryCheckDetail detail : details) {
            detail.setCheckId(id);
            if (detail.getSystemQty() != null && detail.getActualQty() != null) {
                detail.setDiffQty(detail.getActualQty().subtract(detail.getSystemQty()));
            }
            inventoryCheckDetailMapper.updateById(detail);
        }
        return true;
    }

    @Override
    @Transactional
    public boolean finishCheck(Long id) {
        InventoryCheck check = this.getById(id);
        if (check == null || check.getStatus() != 1) {
            return false;
        }

        // 获取盘点明细，计算并调整库存
        LambdaQueryWrapper<InventoryCheckDetail> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InventoryCheckDetail::getCheckId, id);
        List<InventoryCheckDetail> details = inventoryCheckDetailMapper.selectList(wrapper);

        for (InventoryCheckDetail detail : details) {
            if (detail.getDiffQty() != null && detail.getDiffQty().compareTo(BigDecimal.ZERO) != 0) {
                // 调整库存
                Long productId = detail.getProductId();
                Long warehouseId = check.getWarehouseId();
                Long locationId = detail.getLocationId();
                BigDecimal diffQty = detail.getDiffQty();
                BigDecimal costPrice = detail.getDiffAmount() != null && diffQty.compareTo(BigDecimal.ZERO) != 0
                    ? detail.getDiffAmount().divide(diffQty, 4, BigDecimal.ROUND_HALF_UP)
                    : BigDecimal.ZERO;

                // 根据差异调整库存
                if (diffQty.compareTo(BigDecimal.ZERO) > 0) {
                    // 盘盈 - 增加库存
                    inventoryService.addStock(productId, warehouseId, locationId, diffQty, costPrice,
                        check.getCheckNo(), "INVENTORY_CHECK", id);
                } else {
                    // 盘亏 - 减少库存
                    inventoryService.reduceStock(productId, warehouseId, locationId, diffQty.abs(),
                        check.getCheckNo(), "INVENTORY_CHECK", id);
                }
                log.info("盘点调整库存: {} 差异数量 {}", detail.getProductName(), diffQty);
            }
        }

        check.setStatus(2); // 已完成
        check.setFinishTime(LocalDateTime.now());
        return this.updateById(check);
    }

    @Override
    @Transactional
    public boolean cancelCheck(Long id, String reason) {
        InventoryCheck check = this.getById(id);
        if (check == null || check.getStatus() == 2) {
            return false; // 已完成不能取消
        }
        check.setStatus(9); // 已取消
        check.setRemark(reason);
        return this.updateById(check);
    }

    @Override
    public List<InventoryCheckDetail> getDetails(Long checkId) {
        LambdaQueryWrapper<InventoryCheckDetail> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InventoryCheckDetail::getCheckId, checkId);
        return inventoryCheckDetailMapper.selectList(wrapper);
    }

    @Override
    public List<InventoryCheck> listPending(Long warehouseId) {
        LambdaQueryWrapper<InventoryCheck> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(warehouseId != null, InventoryCheck::getWarehouseId, warehouseId)
              .in(InventoryCheck::getStatus, 0, 1) // 待盘点或盘点中
              .orderByDesc(InventoryCheck::getId);
        return this.list(wrapper);
    }
}