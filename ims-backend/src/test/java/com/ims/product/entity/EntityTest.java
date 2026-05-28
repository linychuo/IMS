package com.ims.product.entity;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Product和UnitOfMeasure实体单元测试
 */
class ProductEntityTest {

    @Test
    void testProductEntity() {
        Product product = new Product();
        product.setCode("P001");
        product.setName("测试商品");
        product.setSpec("100g");
        product.setUnit("件");
        product.setBarcode("123456789");
        product.setPurchasePrice(BigDecimal.valueOf(10.00));
        product.setSalePrice(BigDecimal.valueOf(15.00));
        product.setMinSalePrice(BigDecimal.valueOf(12.00));
        product.setStockWarning(100);
        product.setStatus(1);

        assertEquals("P001", product.getCode());
        assertEquals("测试商品", product.getName());
        assertEquals("100g", product.getSpec());
        assertEquals("件", product.getUnit());
        assertEquals("123456789", product.getBarcode());
        assertEquals(BigDecimal.valueOf(10.00), product.getPurchasePrice());
        assertEquals(BigDecimal.valueOf(15.00), product.getSalePrice());
        assertEquals(100, product.getStockWarning());
        assertEquals(1, product.getStatus());
    }

    @Test
    void testUnitOfMeasureEntity() {
        UnitOfMeasure uom = new UnitOfMeasure();
        uom.setCode("PCS");
        uom.setName("件");
        uom.setType(1); // 基本单位
        uom.setStatus(1);
        uom.setRatio(1.0);
        uom.setRemark("基本计量单位");

        assertEquals("PCS", uom.getCode());
        assertEquals("件", uom.getName());
        assertEquals(1, uom.getType());
        assertEquals(1, uom.getStatus());
        assertEquals(1.0, uom.getRatio());
    }

    @Test
    void testUnitOfMeasureAuxiliary() {
        UnitOfMeasure uom = new UnitOfMeasure();
        uom.setCode("BOX");
        uom.setName("箱");
        uom.setType(2); // 辅助单位
        uom.setStatus(1);
        uom.setRatio(24.0); // 1箱=24件
        uom.setRemark("24件/箱");

        assertEquals("BOX", uom.getCode());
        assertEquals("箱", uom.getName());
        assertEquals(2, uom.getType());
        assertEquals(24.0, uom.getRatio());
    }

    @Test
    void testProductWithNullValues() {
        Product product = new Product();
        // Entity should handle null values gracefully
        assertNull(product.getCode());
        assertNull(product.getName());
        assertNull(product.getUnit());
        assertNull(product.getBarcode());
        assertNull(product.getPurchasePrice());
    }
}
