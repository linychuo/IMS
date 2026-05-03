package com.ims.common.result;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

/**
 * 分页结果
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class PageResult<T> extends Result<List<T>> {

    private static final long serialVersionUID = 1L;

    /**
     * 当前页码
     */
    private Integer pageNum = 1;

    /**
     * 每页大小
     */
    private Integer pageSize = 10;

    /**
     * 总记录数
     */
    private Long total = 0L;

    /**
     * 总页数
     */
    private Integer pages = 0;

    public PageResult() {
        super();
    }

    public PageResult(Integer code, String message) {
        super(code, message);
    }

    public PageResult(Integer code, String message, List<T> data) {
        super(code, message, data);
    }

    /**
     * 成功（带分页数据）
     */
    public static <T> PageResult<T> success(List<T> data, Long total, Integer pageNum, Integer pageSize) {
        PageResult<T> result = new PageResult<>(200, "操作成功", data);
        result.setPageNum(pageNum);
        result.setPageSize(pageSize);
        result.setTotal(total);
        result.setPages((int) Math.ceil((double) total / pageSize));
        return result;
    }

    /**
     * 成功（带分页数据，默认从第1页开始）
     */
    public static <T> PageResult<T> success(List<T> data, Long total) {
        return success(data, total, 1, 10);
    }
}