package com.ims.sales.dto;

import com.ims.sales.entity.SalesReturn;
import com.ims.sales.entity.SalesReturnDetail;
import lombok.Data;

import java.util.List;

@Data
public class SalesReturnRequest {
    private SalesReturn salesReturn;
    private List<SalesReturnDetail> details;
}