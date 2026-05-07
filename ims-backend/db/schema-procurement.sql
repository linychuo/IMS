-- 采购管理模块数据库表结构
-- PostgreSQL

-- 供应商表
CREATE TABLE IF NOT EXISTS supplier (
    id VARCHAR(36) PRIMARY KEY,
    supplier_code VARCHAR(50) NOT NULL UNIQUE,
    supplier_name VARCHAR(200) NOT NULL,
    contact VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(500),
    email VARCHAR(100),
    credit_level INT DEFAULT 3 CHECK (credit_level BETWEEN 1 AND 5),
    payable_amount DECIMAL(18, 2) DEFAULT 0,
    paid_amount DECIMAL(18, 2) DEFAULT 0,
    status INT DEFAULT 0 CHECK (status IN (0, 1)),
    remark TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0 CHECK (deleted IN (0, 1))
);

CREATE INDEX idx_supplier_code ON supplier(supplier_code);
CREATE INDEX idx_supplier_name ON supplier(supplier_name);
CREATE INDEX idx_supplier_status ON supplier(status);

-- 采购订单表
CREATE TABLE IF NOT EXISTS purchase_order (
    id VARCHAR(36) PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL UNIQUE,
    supplier_id VARCHAR(36) NOT NULL REFERENCES supplier(id),
    supplier_name VARCHAR(200),
    order_date DATE NOT NULL,
    expected_date DATE,
    status INT DEFAULT 0 CHECK (status IN (0, 1, 2, 3, 4, 5, 9)),
    total_amount DECIMAL(18, 2) DEFAULT 0,
    discount_amount DECIMAL(18, 2) DEFAULT 0,
    net_amount DECIMAL(18, 2) DEFAULT 0,
    remark TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    audited_by VARCHAR(36),
    audited_at TIMESTAMP,
    deleted INT DEFAULT 0 CHECK (deleted IN (0, 1))
);

CREATE INDEX idx_po_order_no ON purchase_order(order_no);
CREATE INDEX idx_po_supplier ON purchase_order(supplier_id);
CREATE INDEX idx_po_status ON purchase_order(status);
CREATE INDEX idx_po_order_date ON purchase_order(order_date);

-- 采购订单明细表
CREATE TABLE IF NOT EXISTS purchase_order_detail (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) NOT NULL REFERENCES purchase_order(id) ON DELETE CASCADE,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(200),
    product_code VARCHAR(50),
    batch_no VARCHAR(50),
    unit_id VARCHAR(36),
    unit_name VARCHAR(50),
    price DECIMAL(18, 4) NOT NULL,
    quantity DECIMAL(18, 4) NOT NULL,
    amount DECIMAL(18, 2),
    delivered_qty DECIMAL(18, 4) DEFAULT 0,
    received_qty DECIMAL(18, 4) DEFAULT 0,
    remark TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0 CHECK (deleted IN (0, 1))
);

CREATE INDEX idx_pod_order ON purchase_order_detail(order_id);
CREATE INDEX idx_pod_product ON purchase_order_detail(product_id);

-- 采购入库单表
CREATE TABLE IF NOT EXISTS purchase_in (
    id VARCHAR(36) PRIMARY KEY,
    in_no VARCHAR(50) NOT NULL UNIQUE,
    order_id VARCHAR(36) REFERENCES purchase_order(id),
    order_no VARCHAR(50),
    supplier_id VARCHAR(36) NOT NULL REFERENCES supplier(id),
    supplier_name VARCHAR(200),
    in_date DATE NOT NULL,
    warehouse_id VARCHAR(36) NOT NULL,
    warehouse_name VARCHAR(200),
    in_by VARCHAR(36),
    in_by_name VARCHAR(100),
    status INT DEFAULT 0 CHECK (status IN (0, 1, 2, 9)),
    total_amount DECIMAL(18, 2) DEFAULT 0,
    remark TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    audited_by VARCHAR(36),
    audited_at TIMESTAMP,
    deleted INT DEFAULT 0 CHECK (deleted IN (0, 1))
);

CREATE INDEX idx_pi_in_no ON purchase_in(in_no);
CREATE INDEX idx_pi_order ON purchase_in(order_id);
CREATE INDEX idx_pi_supplier ON purchase_in(supplier_id);
CREATE INDEX idx_pi_status ON purchase_in(status);

-- 采购入库明细表
CREATE TABLE IF NOT EXISTS purchase_in_detail (
    id VARCHAR(36) PRIMARY KEY,
    in_id VARCHAR(36) NOT NULL REFERENCES purchase_in(id) ON DELETE CASCADE,
    order_detail_id VARCHAR(36),
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(200),
    product_code VARCHAR(50),
    batch_no VARCHAR(50),
    location_id VARCHAR(36),
    location_code VARCHAR(50),
    unit_id VARCHAR(36),
    unit_name VARCHAR(50),
    quantity DECIMAL(18, 4) NOT NULL,
    price DECIMAL(18, 4),
    amount DECIMAL(18, 2),
    check_status INT DEFAULT 0 CHECK (check_status IN (0, 1, 2)),
    checked_qty DECIMAL(18, 4),
    remark TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(36),
    updated_at TIMESTAMP,
    deleted INT DEFAULT 0 CHECK (deleted IN (0, 1))
);

CREATE INDEX idx_pid_in ON purchase_in_detail(in_id);
CREATE INDEX idx_pid_product ON purchase_in_detail(product_id);
CREATE INDEX idx_pid_batch ON purchase_in_detail(batch_no);