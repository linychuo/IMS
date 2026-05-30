package com.ims.common.util;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

/**
 * Excel导出工具类
 */
public class ExcelExporter {

    private final Workbook workbook;
    private final Sheet sheet;
    private int currentRow = 0;

    public ExcelExporter() {
        this.workbook = new XSSFWorkbook();
        this.sheet = workbook.createSheet("Data");
    }

    public void writeHeader(String[] headers) {
        Row row = sheet.createRow(currentRow++);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = row.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(createHeaderStyle());
        }
    }

    public void writeRow(Object[] values) {
        Row row = sheet.createRow(currentRow++);
        for (int i = 0; i < values.length; i++) {
            Cell cell = row.createCell(i);
            Object value = values[i];
            if (value == null) {
                cell.setCellValue("");
            } else if (value instanceof Number) {
                cell.setCellValue(((Number) value).doubleValue());
            } else {
                cell.setCellValue(value.toString());
            }
        }
    }

    public void writeRows(List<Object[]> rows) {
        for (Object[] row : rows) {
            writeRow(row);
        }
    }

    public byte[] toBytes() throws IOException {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            workbook.write(out);
            return out.toByteArray();
        }
    }

    private CellStyle createHeaderStyle() {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }

    public static String[] generateCustomerTemplate() {
        return new String[]{"客户编号", "客户名称", "联系人", "电话", "手机", "邮箱", "地址", "等级", "信用额度", "状态"};
    }

    public static String[] generateSupplierTemplate() {
        return new String[]{"供应商编号", "供应商名称", "联系人", "电话", "地址", "状态"};
    }

    public static String[] generateProductTemplate() {
        return new String[]{"商品编号", "商品名称", "分类ID", "规格", "单位", "条形码", "采购价", "销售价", "最低售价", "库存预警", "状态"};
    }

    public static String[] generateInventoryTemplate() {
        return new String[]{"仓库ID", "库位ID", "商品编号", "批次号", "数量", "成本", "生产日期", "有效期"};
    }
}