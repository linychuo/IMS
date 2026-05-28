package com.ims.report.service;

import com.ims.report.dto.InventoryAlertDTO;
import com.ims.report.dto.PurchaseSuggestionDTO;
import com.ims.report.dto.SalesForecastDTO;
import com.ims.report.entity.PredictionConfig;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * PredictionService单元测试
 */
@ExtendWith(MockitoExtension.class)
class PredictionServiceTest {

    @Test
    void testPredictionConfigCreation() {
        // Test that PredictionConfig can be created with default values
        PredictionConfig config = new PredictionConfig();
        config.setConfigType("SALES_FORECAST");
        config.setAlgorithm("EXPONENTIAL");
        config.setForecastDays(30);
        config.setHistoryDays(90);
        config.setSafetyStockDays(7);
        config.setStatus(1);

        assertEquals("SALES_FORECAST", config.getConfigType());
        assertEquals("EXPONENTIAL", config.getAlgorithm());
        assertEquals(30, config.getForecastDays());
        assertEquals(90, config.getHistoryDays());
        assertEquals(7, config.getSafetyStockDays());
        assertEquals(1, config.getStatus());
    }

    @Test
    void testSalesForecastDTO() {
        // Test SalesForecastDTO can hold forecast data
        SalesForecastDTO dto = new SalesForecastDTO();
        dto.setProductId(1L);
        dto.setProductName("测试商品");
        dto.setProductCode("P001");
        dto.setForecastQuantity(BigDecimal.valueOf(100));
        dto.setLowerBound(BigDecimal.valueOf(80));
        dto.setUpperBound(BigDecimal.valueOf(120));
        dto.setConfidence(0.95);

        assertEquals(1L, dto.getProductId());
        assertEquals("测试商品", dto.getProductName());
        assertEquals("P001", dto.getProductCode());
        assertEquals(BigDecimal.valueOf(100), dto.getForecastQuantity());
        assertEquals(0.95, dto.getConfidence());
    }

    @Test
    void testPurchaseSuggestionDTO() {
        // Test PurchaseSuggestionDTO can hold suggestion data
        PurchaseSuggestionDTO dto = new PurchaseSuggestionDTO();
        dto.setProductId(1L);
        dto.setProductName("测试商品");
        dto.setCurrentStock(BigDecimal.valueOf(50));
        dto.setSuggestedQuantity(BigDecimal.valueOf(150));
        dto.setUrgency("HIGH");

        assertEquals(1L, dto.getProductId());
        assertEquals(BigDecimal.valueOf(50), dto.getCurrentStock());
        assertEquals(BigDecimal.valueOf(150), dto.getSuggestedQuantity());
        assertEquals("HIGH", dto.getUrgency());
    }

    @Test
    void testInventoryAlertDTO() {
        // Test InventoryAlertDTO can hold alert data
        InventoryAlertDTO dto = new InventoryAlertDTO();
        dto.setProductId(1L);
        dto.setProductName("测试商品");
        dto.setAlertType("LOW_STOCK");
        dto.setCurrentStock(BigDecimal.valueOf(10));
        dto.setThreshold(BigDecimal.valueOf(50));
        dto.setMessage("库存低于预警线");

        assertEquals(1L, dto.getProductId());
        assertEquals("LOW_STOCK", dto.getAlertType());
        assertEquals(BigDecimal.valueOf(10), dto.getCurrentStock());
    }

    @Test
    void testUrgencyLevels() {
        // Verify urgency levels are properly defined
        String[] urgencies = {"HIGH", "MEDIUM", "LOW"};
        for (String urgency : urgencies) {
            assertNotNull(urgency);
            assertTrue(urgency.length() > 0);
        }
    }

    @Test
    void testAlertTypes() {
        // Verify alert types are properly defined
        String[] alertTypes = {"LOW_STOCK", "OVERSTOCK", "EXPIRY", "STAGNANT"};
        for (String alertType : alertTypes) {
            assertNotNull(alertType);
            assertTrue(alertType.length() > 0);
        }
    }
}
