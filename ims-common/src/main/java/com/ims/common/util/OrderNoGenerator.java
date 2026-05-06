package com.ims.common.util;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.RandomUtil;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * 单据编号生成器
 * 使用 Java 21 虚拟线程安全的方式生成单据编号
 */
public final class OrderNoGenerator {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final String[] PREFIXES = {"PO", "PI", "SO", "SI", "TR", "IV", "RC", "PA"};

    private OrderNoGenerator() {
    }

    /**
     * 生成采购订单编号 PO + 年月日 + 6位序号
     * 例如: PO20250502000001
     */
    public static String generatePurchaseOrderNo() {
        return generateOrderNo("PO");
    }

    /**
     * 生成采购入库单编号 PI + 年月日 + 6位序号
     */
    public static String generatePurchaseInNo() {
        return generateOrderNo("PI");
    }

    /**
     * 生成销售订单编号 SO + 年月日 + 6位序号
     */
    public static String generateSalesOrderNo() {
        return generateOrderNo("SO");
    }

    /**
     * 生成销售出库单编号 SI + 年月日 + 6位序号
     */
    public static String generateSalesOutNo() {
        return generateOrderNo("SI");
    }

    /**
     * 生成销售退货单编号 SR + 年月日 + 6位序号
     */
    public static String generateSalesReturnNo() {
        return generateOrderNo("SR");
    }

    /**
     * 生成销售价格策略编号 SP + 年月日 + 6位序号
     */
    public static String generateSalesPriceStrategyNo() {
        return generateOrderNo("SP");
    }

    /**
     * 生成调拨单编号 TR + 年月日 + 6位序号
     */
    public static String generateTransferNo() {
        return generateOrderNo("TR");
    }

    /**
     * 生成盘点单编号 IV + 年月日 + 6位序号
     */
    public static String generateInventoryCheckNo() {
        return generateOrderNo("IV");
    }

    /**
     * 生成收款单编号 RC + 年月日 + 6位序号
     */
    public static String generateReceiveNo() {
        return generateOrderNo("RC");
    }

    /**
     * 生成付款单编号 PA + 年月日 + 6位序号
     */
    public static String generatePaymentNo() {
        return generateOrderNo("PA");
    }

    /**
     * 生成核销单编号 WO + 年月日 + 6位序号
     */
    public static String generateWriteoffNo() {
        return generateOrderNo("WO");
    }

    /**
     * 生成财务支出单编号 FO + 年月日 + 6位序号 (退款/付款)
     */
    public static String generateFinanceOutNo() {
        return generateOrderNo("FO");
    }

    /**
     * 生成通用单据编号
     * @param prefix 前缀 (如 PO, SO 等)
     */
    public static String generateOrderNo(String prefix) {
        String datePart = LocalDate.now().format(DATE_FORMAT);
        String randomPart = RandomUtil.randomNumbers(5);
        return prefix + datePart + randomPart;
    }

    /**
     * 生成UUID主键
     */
    public static String generateId() {
        return IdUtil.getSnowflakeNextIdStr();
    }

    /**
     * 生成简单UUID (不带横线)
     */
    public static String generateSimpleUUID() {
        return IdUtil.simpleUUID();
    }
}