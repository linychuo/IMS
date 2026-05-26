package com.ims.inventory.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.ims.core.result.PageResult;
import com.ims.inventory.entity.InventoryCheck;
import com.ims.inventory.entity.InventoryTransfer;
import com.ims.inventory.entity.InventoryTransferDetail;
import com.ims.inventory.entity.InventoryTransferStatusHistory;
import com.ims.inventory.mapper.InventoryTransferDetailMapper;
import com.ims.inventory.mapper.InventoryTransferMapper;
import com.ims.inventory.mapper.InventoryTransferStatusHistoryMapper;
import com.ims.inventory.service.InventoryCheckService;
import com.ims.inventory.service.InventoryService;
import com.ims.inventory.service.InventoryTransferService;
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
 * 库存调拨 Service 实现
 */
@Service
public class InventoryTransferServiceImpl extends ServiceImpl<InventoryTransferMapper, InventoryTransfer> implements InventoryTransferService {

    private static final Logger log = LoggerFactory.getLogger(InventoryTransferServiceImpl.class);

    @Autowired
    private InventoryTransferMapper inventoryTransferMapper;
    @Autowired
    private InventoryTransferDetailMapper inventoryTransferDetailMapper;
    @Autowired
    private InventoryTransferStatusHistoryMapper statusHistoryMapper;
    @Autowired
    private InventoryService inventoryService;

    private void recordStatusChange(InventoryTransfer transfer, Integer fromStatus, Integer toStatus, Long operatorId, String remark) {
        InventoryTransferStatusHistory history = new InventoryTransferStatusHistory();
        history.setTransferId(transfer.getId());
        history.setTransferNo(transfer.getTransferNo());
        history.setFromStatus(fromStatus);
        history.setToStatus(toStatus);
        history.setOperatorId(operatorId);
        history.setOperateTime(LocalDateTime.now());
        history.setRemark(remark);
        statusHistoryMapper.insert(history);
    }

    @Override
    public PageResult<InventoryTransfer> page(Long page, Long pageSize, Long fromWarehouseId, Long toWarehouseId, Integer status) {
        LambdaQueryWrapper<InventoryTransfer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(fromWarehouseId != null, InventoryTransfer::getFromWarehouseId, fromWarehouseId)
              .eq(toWarehouseId != null, InventoryTransfer::getToWarehouseId, toWarehouseId)
              .eq(status != null, InventoryTransfer::getStatus, status)
              .orderByDesc(InventoryTransfer::getId);
        Page<InventoryTransfer> result = this.page(new Page<>(page, pageSize), wrapper);
        return PageResult.of(result);
    }

    @Override
    public InventoryTransfer getById(Long id) {
        return this.getById(id);
    }

    @Override
    @Transactional
    public InventoryTransfer create(InventoryTransfer transfer, List<InventoryTransferDetail> details) {
        // 生成调拨单号
        transfer.setTransferNo("TR" + System.currentTimeMillis());
        transfer.setStatus(0); // 待调拨
        transfer.setCreateTime(LocalDateTime.now());

        // 计算总数量和总金额
        BigDecimal totalQty = BigDecimal.ZERO;
        BigDecimal totalAmt = BigDecimal.ZERO;
        for (InventoryTransferDetail detail : details) {
            totalQty = totalQty.add(detail.getQuantity());
            if (detail.getAmount() != null) {
                totalAmt = totalAmt.add(detail.getAmount());
            }
        }
        transfer.setTotalQuantity(totalQty);
        transfer.setTotalAmount(totalAmt);

        inventoryTransferMapper.insert(transfer);

        // 保存明细
        for (InventoryTransferDetail detail : details) {
            detail.setTransferId(transfer.getId());
            detail.setTransferNo(transfer.getTransferNo());
            detail.setCreateTime(LocalDateTime.now());
            if (detail.getAmount() == null && detail.getQuantity() != null && detail.getCostPrice() != null) {
                detail.setAmount(detail.getQuantity().multiply(detail.getCostPrice()));
            }
            inventoryTransferDetailMapper.insert(detail);
        }

        log.info("创建库存调拨单: {}", transfer.getTransferNo());
        return transfer;
    }

    @Override
    @Transactional
    public boolean approve(Long id, Long auditorId) {
        InventoryTransfer transfer = this.getById(id);
        if (transfer == null || transfer.getStatus() != 0) {
            throw new RuntimeException("只有待调拨状态可审核");
        }
        Integer prevStatus = transfer.getStatus();
        transfer.setStatus(1); // 审核通过，变为调拨中
        transfer.setAuditorId(auditorId);
        transfer.setAuditedAt(LocalDateTime.now());
        this.updateById(transfer);
        recordStatusChange(transfer, prevStatus, 1, auditorId, "审核通过");
        log.info("审核库存调拨单: {} by {}", transfer.getTransferNo(), auditorId);
        return true;
    }

    @Override
    @Transactional
    public boolean reject(Long id, String reason) {
        InventoryTransfer transfer = this.getById(id);
        if (transfer == null || transfer.getStatus() != 0) {
            throw new RuntimeException("只有待调拨状态可拒绝");
        }
        Integer prevStatus = transfer.getStatus();
        transfer.setStatus(9); // 已取消
        transfer.setRemark(reason);
        this.updateById(transfer);
        recordStatusChange(transfer, prevStatus, 9, null, reason);
        log.info("拒绝库存调拨单: {} reason: {}", transfer.getTransferNo(), reason);
        return true;
    }

    @Override
    @Transactional
    public boolean startTransfer(Long id, Long transfererId) {
        InventoryTransfer transfer = this.getById(id);
        if (transfer == null || transfer.getStatus() != 1) {
            return false;
        }
        transfer.setTransfererId(transfererId);
        transfer.setTransferTime(LocalDateTime.now());
        recordStatusChange(transfer, 1, 1, transfererId, "开始调拨");
        return this.updateById(transfer);
    }

    @Override
    @Transactional
    public boolean confirmOut(Long id) {
        InventoryTransfer transfer = this.getById(id);
        if (transfer == null || transfer.getStatus() != 1) {
            return false;
        }

        // 获取调拨明细，执行出库
        LambdaQueryWrapper<InventoryTransferDetail> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InventoryTransferDetail::getTransferId, id);
        List<InventoryTransferDetail> details = inventoryTransferDetailMapper.selectList(wrapper);

        for (InventoryTransferDetail detail : details) {
            // 从源仓库扣减库存
            inventoryService.reduceStock(
                detail.getProductId(),
                transfer.getFromWarehouseId(),
                detail.getFromLocationId(),
                detail.getQuantity(),
                transfer.getTransferNo(),
                "TRANSFER_OUT",
                id
            );
            log.info("调拨出库: {} 数量 {}", detail.getProductName(), detail.getQuantity());
        }
        recordStatusChange(transfer, 1, 1, null, "确认出库");

        return true;
    }

    @Override
    @Transactional
    public boolean confirmIn(Long id) {
        InventoryTransfer transfer = this.getById(id);
        if (transfer == null || transfer.getStatus() != 1) {
            return false;
        }

        // 获取调拨明细，执行入库
        LambdaQueryWrapper<InventoryTransferDetail> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InventoryTransferDetail::getTransferId, id);
        List<InventoryTransferDetail> details = inventoryTransferDetailMapper.selectList(wrapper);

        for (InventoryTransferDetail detail : details) {
            // 入库到目标仓库
            BigDecimal costPrice = detail.getCostPrice() != null ? detail.getCostPrice() : BigDecimal.ZERO;
            inventoryService.addStock(
                detail.getProductId(),
                transfer.getToWarehouseId(),
                detail.getToLocationId(),
                detail.getQuantity(),
                costPrice,
                transfer.getTransferNo(),
                "TRANSFER_IN",
                id
            );
            log.info("调拨入库: {} 数量 {}", detail.getProductName(), detail.getQuantity());
        }
        recordStatusChange(transfer, 1, 1, null, "确认入库");

        return true;
    }

    @Override
    @Transactional
    public boolean finishTransfer(Long id) {
        InventoryTransfer transfer = this.getById(id);
        if (transfer == null || transfer.getStatus() != 1) {
            return false;
        }

        Integer prevStatus = transfer.getStatus();
        transfer.setStatus(2); // 已完成
        transfer.setFinishTime(LocalDateTime.now());
        this.updateById(transfer);
        recordStatusChange(transfer, prevStatus, 2, null, "调拨完成");
        log.info("完成库存调拨单: {}", id);
        return true;
    }

    @Override
    @Transactional
    public boolean cancelTransfer(Long id, String reason) {
        InventoryTransfer transfer = this.getById(id);
        if (transfer == null || transfer.getStatus() == 2) {
            return false; // 已完成不能取消
        }
        Integer prevStatus = transfer.getStatus();
        transfer.setStatus(9); // 已取消
        transfer.setRemark(reason);
        this.updateById(transfer);
        recordStatusChange(transfer, prevStatus, 9, null, reason);
        log.info("取消库存调拨单: {} 原因: {}", id, reason);
        return true;
    }

    @Override
    public List<InventoryTransferDetail> getDetails(Long transferId) {
        LambdaQueryWrapper<InventoryTransferDetail> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(InventoryTransferDetail::getTransferId, transferId);
        return inventoryTransferDetailMapper.selectList(wrapper);
    }

    @Override
    public List<InventoryTransfer> listPending() {
        LambdaQueryWrapper<InventoryTransfer> wrapper = new LambdaQueryWrapper<>();
        wrapper.in(InventoryTransfer::getStatus, 0, 1) // 待调拨或调拨中
              .orderByDesc(InventoryTransfer::getId);
        return this.list(wrapper);
    }
}