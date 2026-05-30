package com.ims.common.util;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Excel导入工具类
 */
public class ExcelImporter {

    private final Workbook workbook;

    public ExcelImporter(byte[] bytes) throws IOException {
        this.workbook = new XSSFWorkbook(new ByteArrayInputStream(bytes));
    }

    public List<String[]> readAllRows() throws IOException {
        List<String[]> rows = new ArrayList<>();
        Sheet sheet = workbook.getSheetAt(0);
        for (Row row : sheet) {
            if (row == null) continue;
            String[] values = new String[row.getLastCellNum()];
            for (int i = 0; i < row.getLastCellNum(); i++) {
                Cell cell = row.getCell(i);
                values[i] = getCellValue(cell);
            }
            rows.add(values);
        }
        return rows;
    }

    public List<String[]> readRows(int startRow, Integer maxRows) throws IOException {
        List<String[]> rows = new ArrayList<>();
        Sheet sheet = workbook.getSheetAt(0);
        int lastRow = sheet.getLastRowNum();
        if (maxRows == null) maxRows = Integer.MAX_VALUE;
        int endRow = Math.min(startRow + maxRows, lastRow + 1);
        for (int i = startRow; i < endRow; i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;
            String[] values = new String[row.getLastCellNum()];
            for (int j = 0; j < row.getLastCellNum(); j++) {
                Cell cell = row.getCell(j);
                values[j] = getCellValue(cell);
            }
            rows.add(values);
        }
        return rows;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING: return cell.getStringCellValue();
            case NUMERIC: return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN: return String.valueOf(cell.getBooleanCellValue());
            case FORMULA: return cell.getCellFormula();
            default: return "";
        }
    }

    public static ImportResult parseCustomerRows(List<String[]> rows) {
        ImportResult result = new ImportResult();
        List<String> errors = new ArrayList<>();
        int success = 0;
        for (int i = 1; i < rows.size(); i++) {
            String[] row = rows.get(i);
            if (row.length < 10) {
                errors.add("第" + (i + 1) + "行: 列数不足");
                continue;
            }
            String code = row[0].trim();
            String name = row[1].trim();
            if (code.isEmpty() || name.isEmpty()) {
                errors.add("第" + (i + 1) + "行: 客户编号或名称不能为空");
                continue;
            }
            success++;
        }
        result.setSuccess(success);
        result.setFailed(rows.size() - 1 - success);
        result.setErrors(errors);
        return result;
    }

    public static ImportResult parseSupplierRows(List<String[]> rows) {
        ImportResult result = new ImportResult();
        List<String> errors = new ArrayList<>();
        int success = 0;
        for (int i = 1; i < rows.size(); i++) {
            String[] row = rows.get(i);
            if (row.length < 6) {
                errors.add("第" + (i + 1) + "行: 列数不足");
                continue;
            }
            String code = row[0].trim();
            String name = row[1].trim();
            if (code.isEmpty() || name.isEmpty()) {
                errors.add("第" + (i + 1) + "行: 供应商编号或名称不能为空");
                continue;
            }
            success++;
        }
        result.setSuccess(success);
        result.setFailed(rows.size() - 1 - success);
        result.setErrors(errors);
        return result;
    }

    public static ImportResult parseProductRows(List<String[]> rows) {
        ImportResult result = new ImportResult();
        List<String> errors = new ArrayList<>();
        int success = 0;
        for (int i = 1; i < rows.size(); i++) {
            String[] row = rows.get(i);
            if (row.length < 11) {
                errors.add("第" + (i + 1) + "行: 列数不足");
                continue;
            }
            String code = row[0].trim();
            String name = row[1].trim();
            if (code.isEmpty() || name.isEmpty()) {
                errors.add("第" + (i + 1) + "行: 商品编号或名称不能为空");
                continue;
            }
            try {
                if (!row[6].trim().isEmpty()) Double.parseDouble(row[6]);
                if (!row[7].trim().isEmpty()) Double.parseDouble(row[7]);
            } catch (NumberFormatException e) {
                errors.add("第" + (i + 1) + "行: 价格格式错误");
                continue;
            }
            success++;
        }
        result.setSuccess(success);
        result.setFailed(rows.size() - 1 - success);
        result.setErrors(errors);
        return result;
    }

    public static class ImportResult {
        private int success;
        private int failed;
        private List<String> errors = new ArrayList<>();

        public int getSuccess() { return success; }
        public void setSuccess(int success) { this.success = success; }
        public int getFailed() { return failed; }
        public void setFailed(int failed) { this.failed = failed; }
        public List<String> getErrors() { return errors; }
        public void setErrors(List<String> errors) { this.errors = errors; }
    }
}