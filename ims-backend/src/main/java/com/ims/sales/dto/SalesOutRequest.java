package com.ims.sales.dto;

import com.ims.sales.entity.SalesOut;
import com.ims.sales.entity.SalesOutDetail;
import lombok.Data;

import java.util.List;

@Data
public class SalesOutRequest {
    private SalesOut salesOut;
    private List<SalesOutDetail> details;
}