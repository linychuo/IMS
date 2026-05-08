-- =============================================
-- IMS 进销存系统 - 统一数据库表结构
-- PostgreSQL
-- =============================================

-- ----------------------------
-- 系统管理表
-- ----------------------------

CREATE TABLE IF NOT EXISTS sys_user (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    real_name VARCHAR(50),
    email VARCHAR(100),
    mobile VARCHAR(20),
    status INT DEFAULT 1,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sys_role (
    id VARCHAR(36) PRIMARY KEY,
    role_code VARCHAR(50) NOT NULL UNIQUE,
    role_name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    status INT DEFAULT 1,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sys_permission (
    id VARCHAR(36) PRIMARY KEY,
    permission_code VARCHAR(100) NOT NULL UNIQUE,
    permission_name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sys_user_role (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(36) NOT NULL
);

CREATE TABLE IF NOT EXISTS sys_role_permission (
    id VARCHAR(36) PRIMARY KEY,
    role_id VARCHAR(36) NOT NULL,
    permission_id VARCHAR(36) NOT NULL
);

-- ----------------------------
-- 基础数据表
-- ----------------------------

-- 供应商表
CREATE TABLE IF NOT EXISTS supplier (
    id VARCHAR(36) PRIMARY KEY,
    supplier_code VARCHAR(50) NOT NULL UNIQUE,
    supplier_name VARCHAR(200) NOT NULL,
    contact VARCHAR(100),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(500),
    level INT DEFAULT 2,
    credit_limit DECIMAL(18,2) DEFAULT 0,
    payable_amount DECIMAL(18,2) DEFAULT 0,
    settle_period INT DEFAULT 30,
    bank_name VARCHAR(100),
    bank_account VARCHAR(50),
    tax_no VARCHAR(50),
    status INT DEFAULT 0,
    remark TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 客户表
CREATE TABLE IF NOT EXISTS customer (
    id VARCHAR(36) PRIMARY KEY,
    customer_code VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(100) NOT NULL,
    customer_type INT DEFAULT 2,
    contact VARCHAR(50),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(500),
    level INT DEFAULT 2,
    credit_limit DECIMAL(18,2) DEFAULT 0,
    receivable_amount DECIMAL(18,2) DEFAULT 0,
    settle_period INT DEFAULT 30,
    bank_name VARCHAR(100),
    bank_account VARCHAR(50),
    tax_no VARCHAR(50),
    status INT DEFAULT 0,
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 商品表
CREATE TABLE IF NOT EXISTS product (
    id VARCHAR(36) PRIMARY KEY,
    product_code VARCHAR(50) NOT NULL UNIQUE,
    product_name VARCHAR(100) NOT NULL,
    category_id VARCHAR(36),
    spec VARCHAR(100),
    unit VARCHAR(20),
    cost DECIMAL(18,4) DEFAULT 0,
    price DECIMAL(18,2) DEFAULT 0,
    stock_warning INT DEFAULT 10,
    status INT DEFAULT 0,
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 商品分类表
CREATE TABLE IF NOT EXISTS product_category (
    id VARCHAR(36) PRIMARY KEY,
    category_code VARCHAR(50) NOT NULL UNIQUE,
    category_name VARCHAR(100) NOT NULL,
    parent_id VARCHAR(36),
    level INT DEFAULT 1,
    sort INT DEFAULT 0,
    status INT DEFAULT 0,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 仓库表
CREATE TABLE IF NOT EXISTS warehouse (
    id VARCHAR(36) PRIMARY KEY,
    warehouse_code VARCHAR(50) NOT NULL UNIQUE,
    warehouse_name VARCHAR(100) NOT NULL,
    contact VARCHAR(50),
    phone VARCHAR(20),
    address VARCHAR(500),
    status INT DEFAULT 0,
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 库位表
CREATE TABLE IF NOT EXISTS location (
    id VARCHAR(36) PRIMARY KEY,
    location_code VARCHAR(50) NOT NULL UNIQUE,
    location_name VARCHAR(100) NOT NULL,
    warehouse_id VARCHAR(36) NOT NULL,
    status INT DEFAULT 0,
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- ----------------------------
-- 采购模块表
-- ----------------------------

-- 采购订单表
CREATE TABLE IF NOT EXISTS purchase_order (
    id VARCHAR(36) PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL UNIQUE,
    supplier_id VARCHAR(36) NOT NULL,
    supplier_name VARCHAR(200),
    order_date DATE NOT NULL,
    expected_date DATE,
    status INT DEFAULT 0,
    total_amount DECIMAL(18,2) DEFAULT 0,
    discount_amount DECIMAL(18,2) DEFAULT 0,
    net_amount DECIMAL(18,2) DEFAULT 0,
    remark TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    audited_by VARCHAR(36),
    audited_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 采购订单明细表
CREATE TABLE IF NOT EXISTS purchase_order_detail (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(200),
    product_code VARCHAR(50),
    batch_no VARCHAR(50),
    unit_id VARCHAR(36),
    unit_name VARCHAR(50),
    price DECIMAL(18,4) NOT NULL,
    quantity DECIMAL(18,4) NOT NULL,
    amount DECIMAL(18,2),
    delivered_qty DECIMAL(18,4) DEFAULT 0,
    received_qty DECIMAL(18,4) DEFAULT 0,
    remark TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 采购入库单表
CREATE TABLE IF NOT EXISTS purchase_in (
    id VARCHAR(36) PRIMARY KEY,
    in_no VARCHAR(50) NOT NULL UNIQUE,
    order_id VARCHAR(36),
    order_no VARCHAR(50),
    supplier_id VARCHAR(36) NOT NULL,
    supplier_name VARCHAR(200),
    in_date DATE NOT NULL,
    warehouse_id VARCHAR(36) NOT NULL,
    warehouse_name VARCHAR(200),
    in_by VARCHAR(36),
    in_by_name VARCHAR(100),
    status INT DEFAULT 0,
    total_amount DECIMAL(18,2) DEFAULT 0,
    remark TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    audited_by VARCHAR(36),
    audited_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 采购入库明细表
CREATE TABLE IF NOT EXISTS purchase_in_detail (
    id VARCHAR(36) PRIMARY KEY,
    in_id VARCHAR(36) NOT NULL,
    order_detail_id VARCHAR(36),
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(200),
    product_code VARCHAR(50),
    batch_no VARCHAR(50),
    location_id VARCHAR(36),
    location_code VARCHAR(50),
    unit_id VARCHAR(36),
    unit_name VARCHAR(50),
    quantity DECIMAL(18,4) NOT NULL,
    price DECIMAL(18,4),
    amount DECIMAL(18,2),
    check_status INT DEFAULT 0,
    checked_qty DECIMAL(18,4),
    remark TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 采购退货单表
CREATE TABLE IF NOT EXISTS purchase_return (
    id VARCHAR(36) PRIMARY KEY,
    return_no VARCHAR(50) NOT NULL UNIQUE,
    purchase_in_id VARCHAR(36),
    purchase_in_no VARCHAR(50),
    supplier_id VARCHAR(36) NOT NULL,
    supplier_name VARCHAR(200),
    return_date DATE,
    warehouse_id VARCHAR(36) NOT NULL,
    warehouse_name VARCHAR(200),
    return_by VARCHAR(36),
    return_by_name VARCHAR(50),
    status INT DEFAULT 0,
    total_amount DECIMAL(18,2) DEFAULT 0,
    refund_amount DECIMAL(18,2) DEFAULT 0,
    reason VARCHAR(500),
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    audited_by VARCHAR(36),
    audited_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 采购退货明细表
CREATE TABLE IF NOT EXISTS purchase_return_detail (
    id VARCHAR(36) PRIMARY KEY,
    return_id VARCHAR(36) NOT NULL,
    return_no VARCHAR(50),
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(200),
    spec VARCHAR(100),
    unit VARCHAR(20),
    quantity DECIMAL(18,4) NOT NULL,
    price DECIMAL(18,2),
    amount DECIMAL(18,2),
    warehouse_id VARCHAR(36),
    location_id VARCHAR(36),
    batch_no VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------
-- 销售模块表
-- ----------------------------

-- 销售订单表
CREATE TABLE IF NOT EXISTS sales_order (
    id VARCHAR(36) PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL UNIQUE,
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(100),
    order_date DATE,
    expected_date DATE,
    status INT DEFAULT 0,
    total_amount DECIMAL(18,2) DEFAULT 0,
    discount_amount DECIMAL(18,2) DEFAULT 0,
    net_amount DECIMAL(18,2) DEFAULT 0,
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    audited_by VARCHAR(36),
    audited_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 销售订单明细表
CREATE TABLE IF NOT EXISTS sales_order_detail (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL,
    order_no VARCHAR(50) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(100),
    spec VARCHAR(100),
    unit VARCHAR(20),
    quantity DECIMAL(18,4) DEFAULT 0,
    price DECIMAL(18,2) DEFAULT 0,
    amount DECIMAL(18,2) DEFAULT 0,
    out_quantity DECIMAL(18,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 销售出库单表
CREATE TABLE IF NOT EXISTS sales_out (
    id VARCHAR(36) PRIMARY KEY,
    out_no VARCHAR(50) NOT NULL UNIQUE,
    order_id VARCHAR(36),
    order_no VARCHAR(50),
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(100),
    out_date DATE,
    warehouse_id VARCHAR(36) NOT NULL,
    warehouse_name VARCHAR(100),
    out_by VARCHAR(36),
    out_by_name VARCHAR(50),
    status INT DEFAULT 0,
    total_amount DECIMAL(18,2) DEFAULT 0,
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    audited_by VARCHAR(36),
    audited_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 销售出库明细表
CREATE TABLE IF NOT EXISTS sales_out_detail (
    id VARCHAR(36) PRIMARY KEY,
    out_id VARCHAR(36) NOT NULL,
    out_no VARCHAR(50) NOT NULL,
    order_detail_id VARCHAR(36),
    product_id VARCHAR(36) NOT NULL,
    warehouse_id VARCHAR(36),
    location_id VARCHAR(36),
    product_name VARCHAR(100),
    spec VARCHAR(100),
    unit VARCHAR(20),
    quantity DECIMAL(18,4) DEFAULT 0,
    price DECIMAL(18,2) DEFAULT 0,
    amount DECIMAL(18,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 销售退货单表
CREATE TABLE IF NOT EXISTS sales_return (
    id VARCHAR(36) PRIMARY KEY,
    return_no VARCHAR(50) NOT NULL UNIQUE,
    order_id VARCHAR(36),
    order_no VARCHAR(50),
    out_id VARCHAR(36),
    out_no VARCHAR(50),
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(100),
    return_date DATE,
    warehouse_id VARCHAR(36) NOT NULL,
    warehouse_name VARCHAR(100),
    return_by VARCHAR(36),
    return_by_name VARCHAR(50),
    status INT DEFAULT 0,
    total_amount DECIMAL(18,2) DEFAULT 0,
    refund_amount DECIMAL(18,2) DEFAULT 0,
    reason VARCHAR(500),
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    audited_by VARCHAR(36),
    audited_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 销售退货明细表
CREATE TABLE IF NOT EXISTS sales_return_detail (
    id VARCHAR(36) PRIMARY KEY,
    return_id VARCHAR(36) NOT NULL,
    return_no VARCHAR(50),
    out_detail_id VARCHAR(36),
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(100),
    spec VARCHAR(100),
    unit VARCHAR(20),
    quantity DECIMAL(18,4) DEFAULT 0,
    price DECIMAL(18,2) DEFAULT 0,
    amount DECIMAL(18,2) DEFAULT 0,
    in_quantity DECIMAL(18,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 销售价格策略表
CREATE TABLE IF NOT EXISTS sales_price_strategy (
    id VARCHAR(36) PRIMARY KEY,
    strategy_no VARCHAR(50) NOT NULL UNIQUE,
    strategy_name VARCHAR(100) NOT NULL,
    customer_id VARCHAR(36),
    product_id VARCHAR(36),
    product_category_id VARCHAR(36),
    start_date DATE,
    end_date DATE,
    price_type INT,
    price DECIMAL(18,2),
    discount_rate DECIMAL(5,2),
    status INT DEFAULT 1,
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- ----------------------------
-- 库存模块表
-- ----------------------------

-- 库存台账表
CREATE TABLE IF NOT EXISTS inventory (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    warehouse_id VARCHAR(36) NOT NULL,
    location_id VARCHAR(36),
    quantity DECIMAL(18,4) DEFAULT 0,
    frozen_quantity DECIMAL(18,4) DEFAULT 0,
    cost DECIMAL(18,4) DEFAULT 0,
    batch_no VARCHAR(50),
    production_date DATE,
    expiry_date DATE,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 入库单表
CREATE TABLE IF NOT EXISTS inventory_in (
    id VARCHAR(36) PRIMARY KEY,
    in_no VARCHAR(50) NOT NULL UNIQUE,
    in_type INT DEFAULT 1,
    warehouse_id VARCHAR(36) NOT NULL,
    source_id VARCHAR(36),
    source_type VARCHAR(20),
    total_amount DECIMAL(18,2) DEFAULT 0,
    status INT DEFAULT 1,
    auditor_id VARCHAR(36),
    audit_time TIMESTAMP,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 入库明细表
CREATE TABLE IF NOT EXISTS inventory_in_detail (
    id VARCHAR(36) PRIMARY KEY,
    in_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    location_id VARCHAR(36),
    quantity DECIMAL(18,4) NOT NULL,
    price DECIMAL(18,4) DEFAULT 0,
    amount DECIMAL(18,2) DEFAULT 0,
    batch_no VARCHAR(50),
    production_date VARCHAR(20),
    expiry_date VARCHAR(20),
    remark VARCHAR(200),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 出库单表
CREATE TABLE IF NOT EXISTS inventory_out (
    id VARCHAR(36) PRIMARY KEY,
    out_no VARCHAR(50) NOT NULL UNIQUE,
    out_type INT DEFAULT 1,
    warehouse_id VARCHAR(36) NOT NULL,
    source_id VARCHAR(36),
    source_type VARCHAR(20),
    total_amount DECIMAL(18,2) DEFAULT 0,
    status INT DEFAULT 1,
    auditor_id VARCHAR(36),
    audit_time TIMESTAMP,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 出库明细表
CREATE TABLE IF NOT EXISTS inventory_out_detail (
    id VARCHAR(36) PRIMARY KEY,
    out_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    location_id VARCHAR(36),
    quantity DECIMAL(18,4) NOT NULL,
    price DECIMAL(18,4) DEFAULT 0,
    amount DECIMAL(18,2) DEFAULT 0,
    batch_no VARCHAR(50),
    remark VARCHAR(200),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 库存盘点表
CREATE TABLE IF NOT EXISTS inventory_check (
    id VARCHAR(36) PRIMARY KEY,
    check_no VARCHAR(50) NOT NULL UNIQUE,
    warehouse_id VARCHAR(36) NOT NULL,
    warehouse_name VARCHAR(100),
    checker_id VARCHAR(36),
    checker_name VARCHAR(50),
    check_date DATE,
    status INT DEFAULT 0,
    total_amount DECIMAL(18,2) DEFAULT 0,
    profit_amount DECIMAL(18,2) DEFAULT 0,
    loss_amount DECIMAL(18,2) DEFAULT 0,
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    audited_by VARCHAR(36),
    audited_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 库存盘点明细表
CREATE TABLE IF NOT EXISTS inventory_check_detail (
    id VARCHAR(36) PRIMARY KEY,
    check_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(100),
    spec VARCHAR(100),
    unit VARCHAR(20),
    warehouse_id VARCHAR(36),
    location_id VARCHAR(36),
    batch_no VARCHAR(50),
    book_quantity DECIMAL(18,4) DEFAULT 0,
    check_quantity DECIMAL(18,4) DEFAULT 0,
    profit_quantity DECIMAL(18,4) DEFAULT 0,
    loss_quantity DECIMAL(18,4) DEFAULT 0,
    profit_amount DECIMAL(18,2) DEFAULT 0,
    loss_amount DECIMAL(18,2) DEFAULT 0,
    remark VARCHAR(200),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 库存调拨表
CREATE TABLE IF NOT EXISTS inventory_transfer (
    id VARCHAR(36) PRIMARY KEY,
    transfer_no VARCHAR(50) NOT NULL UNIQUE,
    out_warehouse_id VARCHAR(36) NOT NULL,
    out_warehouse_name VARCHAR(100),
    in_warehouse_id VARCHAR(36) NOT NULL,
    in_warehouse_name VARCHAR(100),
    transfer_by VARCHAR(36),
    transfer_by_name VARCHAR(50),
    transfer_date DATE,
    status INT DEFAULT 0,
    total_amount DECIMAL(18,2) DEFAULT 0,
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    audited_by VARCHAR(36),
    audited_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 库存调拨明细表
CREATE TABLE IF NOT EXISTS inventory_transfer_detail (
    id VARCHAR(36) PRIMARY KEY,
    transfer_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(100),
    spec VARCHAR(100),
    unit VARCHAR(20),
    out_location_id VARCHAR(36),
    in_location_id VARCHAR(36),
    batch_no VARCHAR(50),
    quantity DECIMAL(18,4) NOT NULL,
    price DECIMAL(18,4) DEFAULT 0,
    amount DECIMAL(18,2) DEFAULT 0,
    remark VARCHAR(200),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 库存变动记录表
CREATE TABLE IF NOT EXISTS inventory_record (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    warehouse_id VARCHAR(36) NOT NULL,
    location_id VARCHAR(36),
    change_type VARCHAR(20) NOT NULL,
    change_quantity DECIMAL(18,4) NOT NULL,
    before_quantity DECIMAL(18,4) NOT NULL,
    after_quantity DECIMAL(18,4) NOT NULL,
    order_type VARCHAR(20),
    order_id VARCHAR(36),
    order_detail_id VARCHAR(36),
    batch_no VARCHAR(50),
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INT DEFAULT 0
);

-- ----------------------------
-- 财务模块表
-- ----------------------------

-- 账户表
CREATE TABLE IF NOT EXISTS account (
    id VARCHAR(36) PRIMARY KEY,
    account_no VARCHAR(50) NOT NULL UNIQUE,
    account_name VARCHAR(100) NOT NULL,
    account_type INT DEFAULT 1,
    bank_name VARCHAR(100),
    bank_account VARCHAR(50),
    balance DECIMAL(18,2) DEFAULT 0,
    status INT DEFAULT 1,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 收入记录表
CREATE TABLE IF NOT EXISTS finance_in (
    id VARCHAR(36) PRIMARY KEY,
    in_no VARCHAR(50) NOT NULL UNIQUE,
    in_type INT DEFAULT 1,
    account_id VARCHAR(36) NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    order_type VARCHAR(20),
    order_id VARCHAR(36),
    order_no VARCHAR(50),
    customer_id VARCHAR(36),
    status INT DEFAULT 1,
    auditor_id VARCHAR(36),
    audit_time TIMESTAMP,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 支出记录表
CREATE TABLE IF NOT EXISTS finance_out (
    id VARCHAR(36) PRIMARY KEY,
    out_no VARCHAR(50) NOT NULL UNIQUE,
    out_type INT DEFAULT 1,
    account_id VARCHAR(36) NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    order_type VARCHAR(20),
    order_id VARCHAR(36),
    order_no VARCHAR(50),
    supplier_id VARCHAR(36),
    status INT DEFAULT 1,
    auditor_id VARCHAR(36),
    audit_time TIMESTAMP,
    remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 账户交易记录表
CREATE TABLE IF NOT EXISTS account_transaction (
    id VARCHAR(36) PRIMARY KEY,
    account_id VARCHAR(36) NOT NULL,
    account_no VARCHAR(50),
    trans_type INT NOT NULL,
    amount DECIMAL(18,2) NOT NULL,
    ref_id VARCHAR(36),
    ref_no VARCHAR(50),
    remark VARCHAR(500),
    creator_id VARCHAR(36),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 应收款表
CREATE TABLE IF NOT EXISTS receivable (
    id VARCHAR(36) PRIMARY KEY,
    receivable_no VARCHAR(50) NOT NULL UNIQUE,
    customer_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(100),
    order_type VARCHAR(20),
    order_id VARCHAR(36),
    order_no VARCHAR(50),
    amount DECIMAL(18,2) NOT NULL,
    received_amount DECIMAL(18,2) DEFAULT 0,
    write_off_time TIMESTAMP,
    status INT DEFAULT 0,
    due_date DATE,
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- 应付款表
CREATE TABLE IF NOT EXISTS payable (
    id VARCHAR(36) PRIMARY KEY,
    payable_no VARCHAR(50) NOT NULL UNIQUE,
    supplier_id VARCHAR(36) NOT NULL,
    supplier_name VARCHAR(100),
    order_type VARCHAR(20),
    order_id VARCHAR(36),
    order_no VARCHAR(50),
    amount DECIMAL(18,2) NOT NULL,
    paid_amount DECIMAL(18,2) DEFAULT 0,
    write_off_time TIMESTAMP,
    status INT DEFAULT 0,
    due_date DATE,
    remark VARCHAR(500),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0
);

-- ----------------------------
-- 初始化数据
-- ----------------------------

-- 管理员用户 (密码: admin123)
INSERT INTO sys_user (id, username, password, real_name, email, status, created_at)
VALUES ('1', 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', '系统管理员', 'admin@ims.com', 1, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

-- 角色
INSERT INTO sys_role (id, role_code, role_name, description, status, created_at)
VALUES ('1', 'ROLE_ADMIN', '系统管理员', '拥有所有权限', 1, CURRENT_TIMESTAMP),
       ('2', 'ROLE_USER', '普通用户', '普通用户角色', 1, CURRENT_TIMESTAMP)
ON CONFLICT (role_code) DO NOTHING;

-- 权限
INSERT INTO sys_permission (id, permission_code, permission_name, description, created_at)
VALUES ('1', 'user:list', '用户查询', '查看用户列表', CURRENT_TIMESTAMP),
       ('2', 'user:create', '用户创建', '创建用户', CURRENT_TIMESTAMP),
       ('3', 'user:update', '用户更新', '更新用户', CURRENT_TIMESTAMP),
       ('4', 'user:delete', '用户删除', '删除用户', CURRENT_TIMESTAMP),
       ('5', 'role:list', '角色查询', '查看角色列表', CURRENT_TIMESTAMP),
       ('6', 'role:create', '角色创建', '创建角色', CURRENT_TIMESTAMP),
       ('7', 'role:update', '角色更新', '更新角色', CURRENT_TIMESTAMP),
       ('8', 'role:delete', '角色删除', '删除角色', CURRENT_TIMESTAMP)
ON CONFLICT (permission_code) DO NOTHING;

-- 管理员角色关联
INSERT INTO sys_user_role (id, user_id, role_id) VALUES ('1', '1', '1')
ON CONFLICT DO NOTHING;

-- ----------------------------
-- 索引
-- ----------------------------

CREATE INDEX idx_supplier_code ON supplier(supplier_code);
CREATE INDEX idx_supplier_status ON supplier(status);
CREATE INDEX idx_customer_code ON customer(customer_code);
CREATE INDEX idx_customer_status ON customer(status);
CREATE INDEX idx_product_code ON product(product_code);
CREATE INDEX idx_warehouse_code ON warehouse(warehouse_code);
CREATE INDEX idx_location_warehouse ON location(warehouse_id);
CREATE INDEX idx_po_order_no ON purchase_order(order_no);
CREATE INDEX idx_po_supplier ON purchase_order(supplier_id);
CREATE INDEX idx_po_status ON purchase_order(status);
CREATE INDEX idx_pod_order ON purchase_order_detail(order_id);
CREATE INDEX idx_pi_in_no ON purchase_in(in_no);
CREATE INDEX idx_pi_supplier ON purchase_in(supplier_id);
CREATE INDEX idx_pid_in ON purchase_in_detail(in_id);
CREATE INDEX idx_so_order_no ON sales_order(order_no);
CREATE INDEX idx_so_customer ON sales_order(customer_id);
CREATE INDEX idx_sod_order ON sales_order_detail(order_id);
CREATE INDEX idx_sout_out_no ON sales_out(out_no);
CREATE INDEX idx_sout_customer ON sales_out(customer_id);
CREATE INDEX idx_sout_order ON sales_out(order_id);
CREATE INDEX idx_sret_order ON sales_return(order_id);
CREATE INDEX idx_sret_customer ON sales_return(customer_id);
CREATE INDEX idx_inventory_product ON inventory(product_id);
CREATE INDEX idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX idx_ii_in_no ON inventory_in(in_no);
CREATE INDEX idx_ii_status ON inventory_in(status);
CREATE INDEX idx_io_out_no ON inventory_out(out_no);
CREATE INDEX idx_io_status ON inventory_out(status);
CREATE INDEX idx_ic_check_no ON inventory_check(check_no);
CREATE INDEX idx_it_transfer_no ON inventory_transfer(transfer_no);
CREATE INDEX idx_ir_product ON inventory_record(product_id);
CREATE INDEX idx_ir_order ON inventory_record(order_type, order_id);
CREATE INDEX idx_account_no ON account(account_no);
CREATE INDEX idx_fi_in_no ON finance_in(in_no);
CREATE INDEX idx_fi_status ON finance_in(status);
CREATE INDEX idx_fo_out_no ON finance_out(out_no);
CREATE INDEX idx_fo_status ON finance_out(status);
