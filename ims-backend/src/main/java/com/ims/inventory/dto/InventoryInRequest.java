package com.ims.inventory.dto;

import com.ims.inventory.entity.InventoryIn;
import com.ims.inventory.entity.InventoryInDetail;
import lombok.Data;

import java.util.List;

@Data
public class InventoryInRequest {
    private InventoryIn in;
    private List<InventoryInDetail> details;
}
