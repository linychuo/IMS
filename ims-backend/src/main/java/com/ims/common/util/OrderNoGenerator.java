package com.ims.common.util;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.RandomUtil;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * 单据编号生成器
 */
@Component
public final class OrderNoGenerator {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final String[] PREFIXES = {"PO", "PI", "SO", "SI", "TR", "IV", "RC", "PA"};

    private OrderNoGenerator() {
    }

    public static String generatePurchaseOrderNo() {
        return generateOrderNo("PO");
    }

    public static String generatePurchaseInNo() {
        return generateOrderNo("PI");
    }

    public static String generateSalesOrderNo() {
        return generateOrderNo("SO");
    }

    public static String generateSalesOutNo() {
        return generateOrderNo("SI");
    }

    public static String generateSalesReturnNo() {
        return generateOrderNo("SR");
    }

    public static String generatePurchaseReturnNo() {
        return generateOrderNo("PR");
    }

    public static String generateSalesPriceStrategyNo() {
        return generateOrderNo("SP");
    }

    public static String generateTransferNo() {
        return generateOrderNo("TR");
    }

    public static String generateInventoryCheckNo() {
        return generateOrderNo("IV");
    }

    public static String generateReceiveNo() {
        return generateOrderNo("RC");
    }

    public static String generatePaymentNo() {
        return generateOrderNo("PA");
    }

    public static String generateWriteoffNo() {
        return generateOrderNo("WO");
    }

    public static String generateFinanceOutNo() {
        return generateOrderNo("FO");
    }

    public static String generateOrderNo(String prefix) {
        String datePart = LocalDate.now().format(DATE_FORMAT);
        String randomPart = RandomUtil.randomNumbers(5);
        return prefix + datePart + randomPart;
    }

    public static String generateId() {
        return IdUtil.getSnowflakeNextIdStr();
    }

    public static String generateSimpleUUID() {
        return IdUtil.simpleUUID();
    }
}