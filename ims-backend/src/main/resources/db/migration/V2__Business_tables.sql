-- V2__Business_tables.sql
-- Business tables for IMS system

-- Create extension for uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sequence for business tables
CREATE SEQUENCE biz_order_seq START WITH 1 INCREMENT BY 1;

-- ========== 销售模块 ==========

-- 销售订单
CREATE TABLE sales_order (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    order_no VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    customer_name VARCHAR(200),
    order_date DATE,
    expected_date DATE,
    status INTEGER DEFAULT 0,
    total_amount DECIMAL(14,2),
    discount_amount DECIMAL(14,2),
    net_amount DECIMAL(14,2),
    remark VARCHAR(500),
    audited_by VARCHAR(100),
    audited_at TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 销售订单明细
CREATE TABLE sales_order_detail (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    order_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(200),
    spec VARCHAR(100),
    unit VARCHAR(20),
    quantity DECIMAL(12,2),
    price DECIMAL(12,2),
    amount DECIMAL(14,2),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 销售出库单
CREATE TABLE sales_out (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    out_no VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT,
    order_no VARCHAR(50),
    customer_id BIGINT NOT NULL,
    customer_name VARCHAR(200),
    out_date DATE,
    warehouse_id BIGINT,
    warehouse_name VARCHAR(100),
    status INTEGER DEFAULT 0,
    total_amount DECIMAL(14,2),
    remark VARCHAR(500),
    audited_by VARCHAR(100),
    audited_at TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 销售出库明细
CREATE TABLE sales_out_detail (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    out_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(200),
    spec VARCHAR(100),
    unit VARCHAR(20),
    quantity DECIMAL(12,2),
    price DECIMAL(12,2),
    amount DECIMAL(14,2),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 销售退货单
CREATE TABLE sales_return (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    return_no VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT,
    order_no VARCHAR(50),
    out_id BIGINT,
    out_no VARCHAR(50),
    customer_id BIGINT NOT NULL,
    customer_name VARCHAR(200),
    return_date DATE,
    warehouse_id BIGINT,
    warehouse_name VARCHAR(100),
    status INTEGER DEFAULT 0,
    total_amount DECIMAL(14,2),
    refund_amount DECIMAL(14,2),
    reason VARCHAR(500),
    remark VARCHAR(500),
    audited_by VARCHAR(100),
    audited_at TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 销售退货明细
CREATE TABLE sales_return_detail (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    return_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(200),
    spec VARCHAR(100),
    unit VARCHAR(20),
    quantity DECIMAL(12,2),
    price DECIMAL(12,2),
    amount DECIMAL(14,2),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 价格策略
CREATE TABLE sales_price_strategy (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    strategy_no VARCHAR(50) NOT NULL UNIQUE,
    strategy_name VARCHAR(100) NOT NULL,
    customer_id BIGINT,
    customer_name VARCHAR(200),
    product_id BIGINT,
    product_name VARCHAR(200),
    product_category_id BIGINT,
    product_category_name VARCHAR(100),
    start_date DATE,
    end_date DATE,
    price_type INTEGER,
    price DECIMAL(12,2),
    discount_rate DECIMAL(5,4),
    status INTEGER DEFAULT 1,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- ========== 采购模块 ==========

-- 采购订单
CREATE TABLE purchase_order (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    order_no VARCHAR(50) NOT NULL UNIQUE,
    supplier_id BIGINT NOT NULL,
    supplier_name VARCHAR(200),
    order_date DATE,
    expected_date DATE,
    status INTEGER DEFAULT 0,
    total_amount DECIMAL(14,2),
    discount_amount DECIMAL(14,2),
    net_amount DECIMAL(14,2),
    remark VARCHAR(500),
    audited_by VARCHAR(100),
    audited_at TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 采购订单明细
CREATE TABLE purchase_order_detail (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    order_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(200),
    spec VARCHAR(100),
    unit VARCHAR(20),
    quantity DECIMAL(12,2),
    price DECIMAL(12,2),
    amount DECIMAL(14,2),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 采购入库单
CREATE TABLE purchase_in (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    in_no VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT,
    order_no VARCHAR(50),
    supplier_id BIGINT NOT NULL,
    supplier_name VARCHAR(200),
    in_date DATE,
    warehouse_id BIGINT NOT NULL,
    warehouse_name VARCHAR(100),
    status INTEGER DEFAULT 0,
    total_amount DECIMAL(14,2),
    remark VARCHAR(500),
    audited_by VARCHAR(100),
    audited_at TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 采购入库明细
CREATE TABLE purchase_in_detail (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    in_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(200),
    spec VARCHAR(100),
    unit VARCHAR(20),
    quantity DECIMAL(12,2),
    price DECIMAL(12,2),
    amount DECIMAL(14,2),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 采购退货单
CREATE TABLE purchase_return (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    return_no VARCHAR(50) NOT NULL UNIQUE,
    purchase_in_id BIGINT,
    purchase_in_no VARCHAR(50),
    supplier_id BIGINT NOT NULL,
    supplier_name VARCHAR(200),
    return_date DATE,
    warehouse_id BIGINT NOT NULL,
    warehouse_name VARCHAR(100),
    return_by VARCHAR(100),
    return_by_name VARCHAR(100),
    status INTEGER DEFAULT 0,
    total_amount DECIMAL(14,2),
    refund_amount DECIMAL(14,2),
    reason VARCHAR(500),
    remark VARCHAR(500),
    audited_by VARCHAR(100),
    audited_at TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 采购退货明细
CREATE TABLE purchase_return_detail (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    return_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(200),
    spec VARCHAR(100),
    unit VARCHAR(20),
    quantity DECIMAL(12,2),
    price DECIMAL(12,2),
    amount DECIMAL(14,2),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- ========== 库存模块 ==========

-- 库存台账 (已有 application.yml 配置 auto-create, 可选)

-- 库存变动记录
CREATE TABLE inventory_record (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200),
    product_code VARCHAR(50),
    warehouse_id BIGINT NOT NULL,
    warehouse_name VARCHAR(100),
    location_id BIGINT,
    location_name VARCHAR(100),
    change_type VARCHAR(20) NOT NULL,
    change_quantity DECIMAL(12,2),
    before_quantity DECIMAL(12,2),
    after_quantity DECIMAL(12,2),
    order_type VARCHAR(30),
    order_id BIGINT,
    order_no VARCHAR(50),
    batch_no VARCHAR(50),
    cost DECIMAL(12,2),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 库存盘点单
CREATE TABLE inventory_check (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    check_no VARCHAR(50) NOT NULL UNIQUE,
    warehouse_id BIGINT NOT NULL,
    warehouse_name VARCHAR(100),
    check_date DATE,
    checker_id BIGINT,
    checker_name VARCHAR(100),
    status INTEGER DEFAULT 0,
    total_amount DECIMAL(14,2),
    profit_amount DECIMAL(14,2),
    loss_amount DECIMAL(14,2),
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 库存盘点明细
CREATE TABLE inventory_check_detail (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    check_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(200),
    spec VARCHAR(100),
    unit VARCHAR(20),
    location_id BIGINT,
    location_name VARCHAR(100),
    book_quantity DECIMAL(12,2),
    actual_quantity DECIMAL(12,2),
    diff_quantity DECIMAL(12,2),
    cost DECIMAL(12,2),
    amount DECIMAL(14,2),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 库存调拨单
CREATE TABLE inventory_transfer (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    transfer_no VARCHAR(50) NOT NULL UNIQUE,
    from_warehouse_id BIGINT NOT NULL,
    from_warehouse_name VARCHAR(100),
    to_warehouse_id BIGINT NOT NULL,
    to_warehouse_name VARCHAR(100),
    transfer_date DATE,
    transferer_id BIGINT,
    transferer_name VARCHAR(100),
    status INTEGER DEFAULT 0,
    total_amount DECIMAL(14,2),
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 库存调拨明细
CREATE TABLE inventory_transfer_detail (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    transfer_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(200),
    spec VARCHAR(100),
    unit VARCHAR(20),
    from_location_id BIGINT,
    from_location_name VARCHAR(100),
    to_location_id BIGINT,
    to_location_name VARCHAR(100),
    quantity DECIMAL(12,2),
    cost DECIMAL(12,2),
    amount DECIMAL(14,2),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- ========== 财务模块 ==========

-- 财务收款单 (已有V1 table: finance_in)

-- 财务付款单
CREATE TABLE finance_out (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    out_no VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT,
    order_no VARCHAR(50),
    supplier_id BIGINT NOT NULL,
    supplier_name VARCHAR(200),
    amount DECIMAL(14,2),
    discount_amount DECIMAL(14,2),
    pay_method INTEGER,
    bank_account VARCHAR(50),
    bank_name VARCHAR(100),
    pay_date TIMESTAMP,
    status INTEGER DEFAULT 1,
    remark VARCHAR(500),
    creator_id BIGINT,
    auditor_id BIGINT,
    audit_time TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 账户表 (已有V1 table: account)

-- 账户交易记录
CREATE TABLE account_transaction (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    account_id BIGINT NOT NULL,
    account_name VARCHAR(100),
    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(14,2),
    balance_before DECIMAL(14,2),
    balance_after DECIMAL(14,2),
    order_type VARCHAR(30),
    order_id BIGINT,
    order_no VARCHAR(50),
    operator_id BIGINT,
    operator_name VARCHAR(100),
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- 核销记录
CREATE TABLE writeoff_record (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    receivable_id BIGINT,
    payable_id BIGINT,
    writeoff_type VARCHAR(20) NOT NULL,
    amount DECIMAL(14,2),
    writeoff_date DATE,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);