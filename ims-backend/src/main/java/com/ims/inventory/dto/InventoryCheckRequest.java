package com.ims.inventory.dto;

import com.ims.inventory.entity.InventoryCheck;
import com.ims.inventory.entity.InventoryCheckDetail;
import lombok.Data;

import java.util.List;

@Data
public class InventoryCheckRequest {
    private InventoryCheck check;
    private List<InventoryCheckDetail> details;
}
