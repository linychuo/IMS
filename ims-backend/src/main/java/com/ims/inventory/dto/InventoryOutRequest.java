package com.ims.inventory.dto;

import com.ims.inventory.entity.InventoryOut;
import com.ims.inventory.entity.InventoryOutDetail;
import lombok.Data;

import java.util.List;

@Data
public class InventoryOutRequest {
    private InventoryOut out;
    private List<InventoryOutDetail> details;
}
