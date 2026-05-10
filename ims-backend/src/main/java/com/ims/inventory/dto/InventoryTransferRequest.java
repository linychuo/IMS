package com.ims.inventory.dto;

import com.ims.inventory.entity.InventoryTransfer;
import com.ims.inventory.entity.InventoryTransferDetail;
import lombok.Data;

import java.util.List;

@Data
public class InventoryTransferRequest {
    private InventoryTransfer transfer;
    private List<InventoryTransferDetail> details;
}
