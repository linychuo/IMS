package com.ims.common.util;

import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * CSV导出工具类
 */
public class CsvExporter {

    private final StringBuilder sb = new StringBuilder();

    public void writeHeader(String[] headers) {
        sb.append(String.join(",", headers)).append("\n");
    }

    public void writeRow(Object[] values) {
        StringBuilder row = new StringBuilder();
        for (int i = 0; i < values.length; i++) {
            if (i > 0) row.append(",");
            Object value = values[i] == null ? "" : values[i];
            String str = value.toString().replace("\"", "\"\"");
            if (str.contains(",") || str.contains("\"") || str.contains("\n")) {
                str = "\"" + str + "\"";
            }
            row.append(str);
        }
        sb.append(row).append("\n");
    }

    public void writeRows(List<Object[]> rows) {
        for (Object[] row : rows) {
            writeRow(row);
        }
    }

    public byte[] toBytes() {
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    public String toString() {
        return sb.toString();
    }
}