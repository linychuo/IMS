-- IMS Finance 模块初始化SQL
-- 创建时间: 2026-05-03

-- 账户表
CREATE TABLE IF NOT EXISTS `account` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `account_no` VARCHAR(50) NOT NULL COMMENT '账户编号',
    `account_name` VARCHAR(100) NOT NULL COMMENT '账户名称',
    `account_type` INT NOT NULL DEFAULT 1 COMMENT '账户类型: 1-现金 2-银行 3-支付宝 4-微信 5-其他',
    `bank_name` VARCHAR(100) DEFAULT NULL COMMENT '开户行',
    `bank_account` VARCHAR(50) DEFAULT NULL COMMENT '银行账号',
    `balance` DECIMAL(18,2) NOT NULL DEFAULT 0.00 COMMENT '当前余额',
    `status` INT NOT NULL DEFAULT 1 COMMENT '状态: 1-启用 2-停用',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记: 0-正常 1-已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_account_no` (`account_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='账户表';

-- 收款单表
CREATE TABLE IF NOT EXISTS `finance_in` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `in_no` VARCHAR(50) NOT NULL COMMENT '收款单号',
    `order_id` BIGINT DEFAULT NULL COMMENT '订单ID(销售订单)',
    `customer_id` BIGINT NOT NULL COMMENT '客户ID',
    `amount` DECIMAL(18,2) NOT NULL COMMENT '收款金额',
    `discount_amount` DECIMAL(18,2) DEFAULT 0.00 COMMENT '优惠金额',
    `pay_method` INT NOT NULL DEFAULT 1 COMMENT '支付方式: 1-现金 2-银行转账 3-支付宝 4-微信 5-其他',
    `bank_account` VARCHAR(50) DEFAULT NULL COMMENT '银行账号',
    `bank_name` VARCHAR(100) DEFAULT NULL COMMENT '开户行',
    `pay_date` DATETIME NOT NULL COMMENT '付款日期',
    `status` INT NOT NULL DEFAULT 1 COMMENT '状态: 1-待审核 2-已审核 3-已取消',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `creator_id` BIGINT NOT NULL COMMENT '创建人ID',
    `auditor_id` BIGINT DEFAULT NULL COMMENT '审核人ID',
    `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记: 0-正常 1-已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_in_no` (`in_no`),
    KEY `idx_customer_id` (`customer_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收款单表';

-- 付款单表
CREATE TABLE IF NOT EXISTS `finance_out` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `out_no` VARCHAR(50) NOT NULL COMMENT '付款单号',
    `order_id` BIGINT DEFAULT NULL COMMENT '订单ID(采购订单)',
    `supplier_id` BIGINT NOT NULL COMMENT '供应商ID',
    `amount` DECIMAL(18,2) NOT NULL COMMENT '付款金额',
    `discount_amount` DECIMAL(18,2) DEFAULT 0.00 COMMENT '优惠金额',
    `pay_method` INT NOT NULL DEFAULT 1 COMMENT '支付方式: 1-现金 2-银行转账 3-支付宝 4-微信 5-其他',
    `bank_account` VARCHAR(50) DEFAULT NULL COMMENT '银行账号',
    `bank_name` VARCHAR(100) DEFAULT NULL COMMENT '开户行',
    `pay_date` DATETIME NOT NULL COMMENT '付款日期',
    `status` INT NOT NULL DEFAULT 1 COMMENT '状态: 1-待审核 2-已审核 3-已取消',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `creator_id` BIGINT NOT NULL COMMENT '创建人ID',
    `auditor_id` BIGINT DEFAULT NULL COMMENT '审核人ID',
    `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记: 0-正常 1-已删除',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_out_no` (`out_no`),
    KEY `idx_supplier_id` (`supplier_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='付款单表';

-- 初始化默认账户数据
INSERT INTO `account` (`account_no`, `account_name`, `account_type`, `bank_name`, `balance`, `status`) VALUES
('ACC001', '现金账户', 1, NULL, 100000.00, 1),
('ACC002', '公司银行账户', 2, '中国工商银行', 500000.00, 1),
('ACC003', '支付宝账户', 3, '支付宝', 0.00, 1);