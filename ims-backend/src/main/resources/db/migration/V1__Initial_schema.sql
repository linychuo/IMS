-- V1__Initial_schema.sql
-- Base tables for IMS system

-- Create extension for uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- System tables sequence
CREATE SEQUENCE sys_user_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE sys_role_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE sys_permission_seq START WITH 1 INCREMENT BY 1;

-- Product category
CREATE TABLE product_category (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    category_code VARCHAR(50) NOT NULL UNIQUE,
    category_name VARCHAR(100) NOT NULL,
    parent_id BIGINT,
    sort_order INTEGER DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- Product
CREATE TABLE product (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    product_code VARCHAR(50) NOT NULL UNIQUE,
    product_name VARCHAR(200) NOT NULL,
    category_id BIGINT,
    unit VARCHAR(20),
    spec VARCHAR(100),
    price DECIMAL(12,2),
    cost DECIMAL(12,2),
    min_stock DECIMAL(12,2) DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- Customer
CREATE TABLE customer (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    customer_code VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(200) NOT NULL,
    contact VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(500),
    credit_limit DECIMAL(12,2),
    receivable_amount DECIMAL(12,2) DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- Supplier
CREATE TABLE supplier (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    supplier_code VARCHAR(50) NOT NULL UNIQUE,
    supplier_name VARCHAR(200) NOT NULL,
    contact VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- Warehouse
CREATE TABLE warehouse (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    warehouse_code VARCHAR(50) NOT NULL UNIQUE,
    warehouse_name VARCHAR(100) NOT NULL,
    address VARCHAR(500),
    manager VARCHAR(100),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- Inventory location
CREATE TABLE inv_location (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    warehouse_id BIGINT NOT NULL,
    location_code VARCHAR(50) NOT NULL,
    location_name VARCHAR(100),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    UNIQUE(warehouse_id, location_code)
);

-- System user
CREATE TABLE sys_user (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL,
    real_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    status INTEGER DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- System role
CREATE TABLE sys_role (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_role_seq'),
    role_code VARCHAR(50) NOT NULL UNIQUE,
    role_name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0
);

-- User role relation
CREATE TABLE sys_user_role (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System permission
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

-- Role permission relation
CREATE TABLE sys_role_permission (
    id BIGINT PRIMARY KEY DEFAULT nextval('sys_user_seq'),
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);