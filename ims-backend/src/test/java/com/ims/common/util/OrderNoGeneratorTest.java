package com.ims.common.util;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.HashSet;
import java.util.Set;

/**
 * OrderNoGenerator单元测试
 */
class OrderNoGeneratorTest {

    @Test
    void testGeneratePurchaseOrderNo() {
        String no = OrderNoGenerator.generatePurchaseOrderNo();
        assertNotNull(no);
        assertTrue(no.startsWith("PO"));
        assertEquals(17, no.length()); // PO + yyyyMMdd(8) + 5位随机
    }

    @Test
    void testGenerateSalesOrderNo() {
        String no = OrderNoGenerator.generateSalesOrderNo();
        assertNotNull(no);
        assertTrue(no.startsWith("SO"));
        assertEquals(17, no.length());
    }

    @Test
    void testGeneratePurchaseInNo() {
        String no = OrderNoGenerator.generatePurchaseInNo();
        assertNotNull(no);
        assertTrue(no.startsWith("PI"));
    }

    @Test
    void testGenerateSalesOutNo() {
        String no = OrderNoGenerator.generateSalesOutNo();
        assertNotNull(no);
        assertTrue(no.startsWith("SI"));
    }

    @Test
    void testGenerateOrderNoUniqueness() {
        Set<String> nos = new HashSet<>();
        for (int i = 0; i < 100; i++) {
            String no = OrderNoGenerator.generatePurchaseOrderNo();
            assertTrue(nos.add(no), "Generated duplicate order number: " + no);
        }
    }

    @Test
    void testGenerateSimpleUUID() {
        String uuid = OrderNoGenerator.generateSimpleUUID();
        assertNotNull(uuid);
        assertEquals(32, uuid.length()); // Simple UUID is 32 hex chars
    }

    @Test
    void testGenerateId() {
        String id1 = OrderNoGenerator.generateId();
        String id2 = OrderNoGenerator.generateId();
        assertNotNull(id1);
        assertNotNull(id2);
        assertNotEquals(id1, id2); // Snowflake IDs should be unique
    }
}
