package com.ims.sales.dto;

import com.ims.sales.entity.SalesOrder;
import com.ims.sales.entity.SalesOrderDetail;
import lombok.Data;

import java.util.List;

@Data
public class SalesOrderRequest {
    private SalesOrder salesOrder;
    private List<SalesOrderDetail> details;
}
