-- 销售模块数据库表
-- 作者: 系统
-- 日期: 2026-05-03

-- 客户表
CREATE TABLE IF NOT EXISTS customer (
    id VARCHAR(32) PRIMARY KEY,
    customer_no VARCHAR(32) NOT NULL UNIQUE COMMENT '客户编号',
    customer_name VARCHAR(100) NOT NULL COMMENT '客户名称',
    customer_type TINYINT COMMENT '客户类型: 1-个人/2-企业',
    contact_person VARCHAR(50) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    address VARCHAR(200) COMMENT '地址',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用/1-启用',
    remark VARCHAR(500) COMMENT '备注',
    created_by VARCHAR(32) COMMENT '创建人',
    created_at DATETIME COMMENT '创建时间',
    updated_by VARCHAR(32) COMMENT '更新人',
    updated_at DATETIME COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记'
) COMMENT '客户表';

-- 销售订单表
CREATE TABLE IF NOT EXISTS sales_order (
    id VARCHAR(32) PRIMARY KEY,
    order_no VARCHAR(32) NOT NULL UNIQUE COMMENT '订单编号',
    customer_id VARCHAR(32) NOT NULL COMMENT '客户ID',
    customer_name VARCHAR(100) COMMENT '客户名称',
    order_date DATE COMMENT '订单日期',
    expected_date DATE COMMENT '要求交货日期',
    status TINYINT DEFAULT 0 COMMENT '状态: 0-待审核/1-已审核/2-部分出库/3-已完成/9-已取消',
    total_amount DECIMAL(18,2) DEFAULT 0 COMMENT '订单总金额',
    discount_amount DECIMAL(18,2) DEFAULT 0 COMMENT '优惠金额',
    net_amount DECIMAL(18,2) DEFAULT 0 COMMENT '实际金额',
    remark VARCHAR(500) COMMENT '备注',
    created_by VARCHAR(32) COMMENT '创建人',
    created_at DATETIME COMMENT '创建时间',
    updated_by VARCHAR(32) COMMENT '更新人',
    updated_at DATETIME COMMENT '更新时间',
    audited_by VARCHAR(32) COMMENT '审核人',
    audited_at DATETIME COMMENT '审核时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记'
) COMMENT '销售订单表';

-- 销售订单明细表
CREATE TABLE IF NOT EXISTS sales_order_detail (
    id VARCHAR(32) PRIMARY KEY,
    order_id VARCHAR(32) NOT NULL COMMENT '订单ID',
    order_no VARCHAR(32) NOT NULL COMMENT '订单编号',
    product_id VARCHAR(32) NOT NULL COMMENT '商品ID',
    product_name VARCHAR(100) COMMENT '商品名称',
    spec VARCHAR(100) COMMENT '商品规格',
    unit VARCHAR(20) COMMENT '单位',
    quantity DECIMAL(18,4) DEFAULT 0 COMMENT '数量',
    price DECIMAL(18,2) DEFAULT 0 COMMENT '单价',
    amount DECIMAL(18,2) DEFAULT 0 COMMENT '金额',
    out_quantity DECIMAL(18,4) DEFAULT 0 COMMENT '已出库数量',
    created_at DATETIME COMMENT '创建时间'
) COMMENT '销售订单明细表';

-- 销售出库单表
CREATE TABLE IF NOT EXISTS sales_out (
    id VARCHAR(32) PRIMARY KEY,
    out_no VARCHAR(32) NOT NULL UNIQUE COMMENT '出库单编号',
    order_id VARCHAR(32) COMMENT '关联销售订单ID',
    order_no VARCHAR(32) COMMENT '关联销售订单号',
    customer_id VARCHAR(32) NOT NULL COMMENT '客户ID',
    customer_name VARCHAR(100) COMMENT '客户名称',
    out_date DATE COMMENT '出库日期',
    warehouse_id VARCHAR(32) NOT NULL COMMENT '仓库ID',
    warehouse_name VARCHAR(100) COMMENT '仓库名称',
    out_by VARCHAR(32) COMMENT '出库人ID',
    out_by_name VARCHAR(50) COMMENT '出库人姓名',
    status TINYINT DEFAULT 0 COMMENT '状态: 0-待出库/1-部分出库/2-已完成/9-已取消',
    total_amount DECIMAL(18,2) DEFAULT 0 COMMENT '出库总金额',
    remark VARCHAR(500) COMMENT '备注',
    created_by VARCHAR(32) COMMENT '创建人',
    created_at DATETIME COMMENT '创建时间',
    updated_by VARCHAR(32) COMMENT '更新人',
    updated_at DATETIME COMMENT '更新时间',
    audited_by VARCHAR(32) COMMENT '审核人',
    audited_at DATETIME COMMENT '审核时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记'
) COMMENT '销售出库单表';

-- 销售出库明细表
CREATE TABLE IF NOT EXISTS sales_out_detail (
    id VARCHAR(32) PRIMARY KEY,
    out_id VARCHAR(32) NOT NULL COMMENT '出库单ID',
    out_no VARCHAR(32) NOT NULL COMMENT '出库单编号',
    order_detail_id VARCHAR(32) COMMENT '关联订单明细ID',
    product_id VARCHAR(32) NOT NULL COMMENT '商品ID',
    product_name VARCHAR(100) COMMENT '商品名称',
    spec VARCHAR(100) COMMENT '商品规格',
    unit VARCHAR(20) COMMENT '单位',
    quantity DECIMAL(18,4) DEFAULT 0 COMMENT '出库数量',
    price DECIMAL(18,2) DEFAULT 0 COMMENT '单价',
    amount DECIMAL(18,2) DEFAULT 0 COMMENT '金额',
    created_at DATETIME COMMENT '创建时间'
) COMMENT '销售出库明细表';

-- 销售退货单表
CREATE TABLE IF NOT EXISTS sales_return (
    id VARCHAR(32) PRIMARY KEY,
    return_no VARCHAR(32) NOT NULL UNIQUE COMMENT '退货单编号',
    order_id VARCHAR(32) COMMENT '关联销售订单ID',
    order_no VARCHAR(32) COMMENT '关联销售订单号',
    out_id VARCHAR(32) COMMENT '关联销售出库单ID',
    out_no VARCHAR(32) COMMENT '关联销售出库单号',
    customer_id VARCHAR(32) NOT NULL COMMENT '客户ID',
    customer_name VARCHAR(100) COMMENT '客户名称',
    return_date DATE COMMENT '退货日期',
    warehouse_id VARCHAR(32) NOT NULL COMMENT '仓库ID',
    warehouse_name VARCHAR(100) COMMENT '仓库名称',
    return_by VARCHAR(32) COMMENT '退货人ID',
    return_by_name VARCHAR(50) COMMENT '退货人姓名',
    status TINYINT DEFAULT 0 COMMENT '状态: 0-待审核/1-已审核/2-已入库/9-已拒绝',
    total_amount DECIMAL(18,2) DEFAULT 0 COMMENT '退货总金额',
    refund_amount DECIMAL(18,2) DEFAULT 0 COMMENT '退款金额',
    reason VARCHAR(500) COMMENT '退货原因',
    remark VARCHAR(500) COMMENT '备注',
    created_by VARCHAR(32) COMMENT '创建人',
    created_at DATETIME COMMENT '创建时间',
    updated_by VARCHAR(32) COMMENT '更新人',
    updated_at DATETIME COMMENT '更新时间',
    audited_by VARCHAR(32) COMMENT '审核人',
    audited_at DATETIME COMMENT '审核时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记'
) COMMENT '销售退货单表';

-- 销售退货明细表
CREATE TABLE IF NOT EXISTS sales_return_detail (
    id VARCHAR(32) PRIMARY KEY,
    return_id VARCHAR(32) NOT NULL COMMENT '退货单ID',
    return_no VARCHAR(32) NOT NULL COMMENT '退货单编号',
    out_detail_id VARCHAR(32) COMMENT '关联出库明细ID',
    product_id VARCHAR(32) NOT NULL COMMENT '商品ID',
    product_name VARCHAR(100) COMMENT '商品名称',
    spec VARCHAR(100) COMMENT '商品规格',
    unit VARCHAR(20) COMMENT '单位',
    quantity DECIMAL(18,4) DEFAULT 0 COMMENT '退货数量',
    price DECIMAL(18,2) DEFAULT 0 COMMENT '单价',
    amount DECIMAL(18,2) DEFAULT 0 COMMENT '金额',
    in_quantity DECIMAL(18,4) DEFAULT 0 COMMENT '已入库数量',
    created_at DATETIME COMMENT '创建时间'
) COMMENT '销售退货明细表';

-- 销售价格策略表 (P1)
CREATE TABLE IF NOT EXISTS sales_price_strategy (
    id VARCHAR(32) PRIMARY KEY,
    strategy_no VARCHAR(32) NOT NULL UNIQUE COMMENT '策略编号',
    strategy_name VARCHAR(100) NOT NULL COMMENT '策略名称',
    customer_id VARCHAR(32) COMMENT '客户ID(空表示全局)',
    product_id VARCHAR(32) COMMENT '商品ID(空表示全局)',
    product_category_id VARCHAR(32) COMMENT '商品分类ID',
    start_date DATE COMMENT '开始日期',
    end_date DATE COMMENT '结束日期',
    price_type TINYINT COMMENT '价格类型: 1-固定价/2-折扣率',
    price DECIMAL(18,2) COMMENT '价格',
    discount_rate DECIMAL(5,2) COMMENT '折扣率',
    status TINYINT DEFAULT 1 COMMENT '状态: 0-禁用/1-启用',
    remark VARCHAR(500) COMMENT '备注',
    created_by VARCHAR(32) COMMENT '创建人',
    created_at DATETIME COMMENT '创建时间',
    updated_by VARCHAR(32) COMMENT '更新人',
    updated_at DATETIME COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '删除标记'
) COMMENT '销售价格策略表';

-- 创建索引
CREATE INDEX idx_sales_order_customer ON sales_order(customer_id);
CREATE INDEX idx_sales_order_status ON sales_order(status);
CREATE INDEX idx_sales_order_detail_order ON sales_order_detail(order_id);
CREATE INDEX idx_sales_out_customer ON sales_out(customer_id);
CREATE INDEX idx_sales_out_order ON sales_out(order_id);
CREATE INDEX idx_sales_out_detail_out ON sales_out_detail(out_id);
CREATE INDEX idx_sales_return_order ON sales_return(order_id);
CREATE INDEX idx_sales_return_out ON sales_return(out_id);
CREATE INDEX idx_sales_return_customer ON sales_return(customer_id);
CREATE INDEX idx_sales_return_detail_return ON sales_return_detail(return_id);
CREATE INDEX idx_sales_price_strategy_customer ON sales_price_strategy(customer_id);
CREATE INDEX idx_sales_price_strategy_product ON sales_price_strategy(product_id);