package com.ims.common.result;

import java.util.List;

/**
 * 分页结果
 */
public class PageResult<T> extends Result<List<T>> {

    private static final long serialVersionUID = 1L;

    private Integer pageNum = 1;
    private Integer pageSize = 10;
    private Long total = 0L;
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

    public static <T> PageResult<T> success(List<T> data, Long total, Integer pageNum, Integer pageSize) {
        PageResult<T> result = new PageResult<>(200, "操作成功", data);
        result.setPageNum(pageNum);
        result.setPageSize(pageSize);
        result.setTotal(total);
        result.setPages((int) Math.ceil((double) total / pageSize));
        return result;
    }

    public static <T> PageResult<T> success(List<T> data, Long total) {
        return success(data, total, 1, 10);
    }

    public Integer getPageNum() { return pageNum; }
    public void setPageNum(Integer pageNum) { this.pageNum = pageNum; }
    public Integer getPageSize() { return pageSize; }
    public void setPageSize(Integer pageSize) { this.pageSize = pageSize; }
    public Long getTotal() { return total; }
    public void setTotal(Long total) { this.total = total; }
    public Integer getPages() { return pages; }
    public void setPages(Integer pages) { this.pages = pages; }
}
