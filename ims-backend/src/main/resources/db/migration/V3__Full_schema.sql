-- V3__Full_schema.sql
-- Complete schema for IMS system (aligned with Java entities)

-- Drop existing tables for clean start (if needed)
DROP TABLE IF EXISTS inventory_transfer_detail CASCADE;
DROP TABLE IF EXISTS inventory_transfer CASCADE;
DROP TABLE IF EXISTS inventory_check_detail CASCADE;
DROP TABLE IF EXISTS inventory_check CASCADE;
DROP TABLE IF EXISTS inventory_record CASCADE;
DROP TABLE IF EXISTS inventory_in_detail CASCADE;
DROP TABLE IF EXISTS inventory_in CASCADE;
DROP TABLE IF EXISTS inventory_out_detail CASCADE;
DROP TABLE IF EXISTS inventory_out CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS purchase_return_detail CASCADE;
DROP TABLE IF EXISTS purchase_return CASCADE;
DROP TABLE IF EXISTS purchase_in_detail CASCADE;
DROP TABLE IF EXISTS purchase_in CASCADE;
DROP TABLE IF EXISTS purchase_order_detail CASCADE;
DROP TABLE IF EXISTS purchase_order CASCADE;
DROP TABLE IF EXISTS sales_return_detail CASCADE;
DROP TABLE IF EXISTS sales_return CASCADE;
DROP TABLE IF EXISTS sales_out_detail CASCADE;
DROP TABLE IF EXISTS sales_out CASCADE;
DROP TABLE IF EXISTS sales_order_detail CASCADE;
DROP TABLE IF EXISTS sales_order CASCADE;
DROP TABLE IF EXISTS sales_price_strategy CASCADE;
DROP TABLE IF EXISTS writeoff_record CASCADE;
DROP TABLE IF EXISTS payable CASCADE;
DROP TABLE IF EXISTS receivable CASCADE;
DROP TABLE IF EXISTS account_transaction CASCADE;
DROP TABLE IF EXISTS finance_out CASCADE;
DROP TABLE IF EXISTS finance_in CASCADE;
DROP TABLE IF EXISTS account CASCADE;
DROP TABLE IF EXISTS product CASCADE;
DROP TABLE IF EXISTS product_category CASCADE;
DROP TABLE IF EXISTS supplier CASCADE;
DROP TABLE IF EXISTS customer CASCADE;
DROP TABLE IF EXISTS inv_location CASCADE;
DROP TABLE IF EXISTS warehouse CASCADE;
DROP TABLE IF EXISTS sys_user_role CASCADE;
DROP TABLE IF EXISTS sys_role_permission CASCADE;
DROP TABLE IF EXISTS sys_permission CASCADE;
DROP TABLE IF EXISTS sys_role CASCADE;
DROP TABLE IF EXISTS sys_user CASCADE;

-- Drop sequences
DROP SEQUENCE IF EXISTS sys_user_seq CASCADE;
DROP SEQUENCE IF EXISTS sys_role_seq CASCADE;
DROP SEQUENCE IF EXISTS sys_permission_seq CASCADE;
DROP SEQUENCE IF EXISTS biz_order_seq CASCADE;

-- Create sequences
CREATE SEQUENCE sys_user_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE sys_role_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE sys_permission_seq START WITH 1 INCREMENT BY 1;

-- ========== System Module ==========

CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    real_name VARCHAR(100),
    email VARCHAR(100),
    mobile VARCHAR(20),
    status INTEGER DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE sys_role (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_role_seq'),
    role_code VARCHAR(50) NOT NULL UNIQUE,
    role_name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    status INTEGER DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE sys_permission (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_permission_seq'),
    permission_code VARCHAR(100) NOT NULL UNIQUE,
    permission_name VARCHAR(100) NOT NULL,
    parent_id BIGINT,
    sort_order INTEGER DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE sys_user_role (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sys_role_permission (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========== Base Data Module ==========

CREATE TABLE product_category (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    category_code VARCHAR(50) NOT NULL UNIQUE,
    category_name VARCHAR(100) NOT NULL,
    parent_id BIGINT,
    level INTEGER,
    sort_order INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE product (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    product_code VARCHAR(50) NOT NULL UNIQUE,
    product_name VARCHAR(200) NOT NULL,
    category_id BIGINT,
    unit VARCHAR(20),
    spec VARCHAR(100),
    barcode VARCHAR(50),
    purchase_price DECIMAL(12,2),
    sale_price DECIMAL(12,2),
    min_sale_price DECIMAL(12,2),
    cost DECIMAL(12,2),
    min_stock DECIMAL(12,2) DEFAULT 0,
    status INTEGER DEFAULT 1,
    image_url VARCHAR(500),
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE supplier (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    supplier_code VARCHAR(50) NOT NULL UNIQUE,
    supplier_name VARCHAR(200) NOT NULL,
    contact VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(500),
    status INTEGER DEFAULT 1,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE customer (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    customer_code VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(200) NOT NULL,
    customer_type INTEGER DEFAULT 1,
    contact VARCHAR(100),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(500),
    level INTEGER DEFAULT 2,
    credit_limit DECIMAL(12,2),
    receivable_amount DECIMAL(12,2) DEFAULT 0,
    settle_period INTEGER,
    bank_name VARCHAR(100),
    bank_account VARCHAR(50),
    tax_no VARCHAR(50),
    status INTEGER DEFAULT 1,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE warehouse (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    warehouse_code VARCHAR(50) NOT NULL UNIQUE,
    warehouse_name VARCHAR(100) NOT NULL,
    warehouse_type INTEGER DEFAULT 1,
    address VARCHAR(500),
    manager VARCHAR(100),
    phone VARCHAR(20),
    status INTEGER DEFAULT 1,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE inv_location (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    warehouse_id BIGINT NOT NULL,
    location_code VARCHAR(50) NOT NULL,
    location_name VARCHAR(100),
    shelf_no VARCHAR(50),
    row_no INTEGER,
    col_no INTEGER,
    level_no INTEGER,
    location_type INTEGER DEFAULT 1,
    status INTEGER DEFAULT 1,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    UNIQUE(warehouse_id, location_code)
);

-- ========== Finance Module ==========

CREATE TABLE account (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    account_name VARCHAR(100) NOT NULL,
    account_type INTEGER NOT NULL,
    bank_name VARCHAR(100),
    bank_account VARCHAR(50),
    balance DECIMAL(14,2) DEFAULT 0,
    status INTEGER DEFAULT 1,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE finance_in (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    in_no VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT,
    customer_id BIGINT NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
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

CREATE TABLE finance_out (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    out_no VARCHAR(50) NOT NULL UNIQUE,
    order_id BIGINT,
    supplier_id BIGINT NOT NULL,
    amount DECIMAL(14,2) NOT NULL,
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

CREATE TABLE receivable (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    receivable_no VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    order_type VARCHAR(30),
    order_id BIGINT,
    order_no VARCHAR(50),
    total_amount DECIMAL(14,2),
    paid_amount DECIMAL(14,2) DEFAULT 0,
    pending_amount DECIMAL(14,2),
    due_date DATE,
    overdue_days INTEGER,
    status INTEGER DEFAULT 1,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE payable (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    payable_no VARCHAR(50) NOT NULL UNIQUE,
    supplier_id BIGINT NOT NULL,
    order_type VARCHAR(30),
    order_id BIGINT,
    order_no VARCHAR(50),
    total_amount DECIMAL(14,2),
    paid_amount DECIMAL(14,2) DEFAULT 0,
    pending_amount DECIMAL(14,2),
    due_date DATE,
    overdue_days INTEGER,
    status INTEGER DEFAULT 1,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

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

-- ========== Sales Module ==========

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

-- ========== Procurement Module ==========

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
    in_by VARCHAR(100),
    in_by_name VARCHAR(100),
    status INTEGER DEFAULT 0,
    total_amount DECIMAL(14,2),
    remark VARCHAR(500),
    audited_by VARCHAR(100),
    audited_at TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

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

-- ========== Inventory Module ==========

CREATE TABLE inventory (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT NOT NULL,
    location_id BIGINT,
    quantity DECIMAL(12,2) DEFAULT 0,
    frozen_quantity DECIMAL(12,2) DEFAULT 0,
    cost DECIMAL(12,2),
    batch_no VARCHAR(50),
    production_date DATE,
    expiry_date DATE,
    product_name VARCHAR(200),
    product_code VARCHAR(50),
    warehouse_name VARCHAR(100),
    location_name VARCHAR(100),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

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

CREATE TABLE inventory_in (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    in_no VARCHAR(50) NOT NULL UNIQUE,
    in_type INTEGER DEFAULT 1,
    order_id BIGINT,
    order_no VARCHAR(50),
    supplier_id BIGINT,
    supplier_name VARCHAR(200),
    in_date DATE,
    warehouse_id BIGINT NOT NULL,
    warehouse_name VARCHAR(100),
    in_by VARCHAR(100),
    in_by_name VARCHAR(100),
    status INTEGER DEFAULT 0,
    total_amount DECIMAL(14,2),
    remark VARCHAR(500),
    audited_by VARCHAR(100),
    audited_at TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE inventory_in_detail (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    in_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(200),
    spec VARCHAR(100),
    unit VARCHAR(20),
    quantity DECIMAL(12,2),
    price DECIMAL(12,2),
    amount DECIMAL(14,2),
    location_id BIGINT,
    location_name VARCHAR(100),
    batch_no VARCHAR(50),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE inventory_out (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    out_no VARCHAR(50) NOT NULL UNIQUE,
    out_type INTEGER DEFAULT 1,
    order_id BIGINT,
    order_no VARCHAR(50),
    customer_id BIGINT,
    customer_name VARCHAR(200),
    out_date DATE,
    warehouse_id BIGINT NOT NULL,
    warehouse_name VARCHAR(100),
    out_by VARCHAR(100),
    out_by_name VARCHAR(100),
    status INTEGER DEFAULT 0,
    total_amount DECIMAL(14,2),
    remark VARCHAR(500),
    audited_by VARCHAR(100),
    audited_at TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

CREATE TABLE inventory_out_detail (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    out_id BIGINT NOT NULL,
    product_id BIGINT,
    product_name VARCHAR(200),
    spec VARCHAR(100),
    unit VARCHAR(20),
    quantity DECIMAL(12,2),
    price DECIMAL(12,2),
    amount DECIMAL(14,2),
    location_id BIGINT,
    location_name VARCHAR(100),
    batch_no VARCHAR(50),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

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