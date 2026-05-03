-- =============================================
-- 财务模块数据库表
-- =============================================

-- 账户表
CREATE TABLE IF NOT EXISTS `account` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `account_no` VARCHAR(50) NOT NULL COMMENT '账户编号',
    `account_name` VARCHAR(100) NOT NULL COMMENT '账户名称',
    `account_type` INT NOT NULL DEFAULT '1' COMMENT '账户类型: 1-现金 2-银行 3-支付宝 4-微信 5-其他',
    `bank_name` VARCHAR(100) DEFAULT NULL COMMENT '开户行',
    `bank_account` VARCHAR(50) DEFAULT NULL COMMENT '银行账号',
    `balance` DECIMAL(18,2) DEFAULT '0.00' COMMENT '当前余额',
    `status` INT NOT NULL DEFAULT '1' COMMENT '状态: 1-启用 2-停用',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` BIT(1) DEFAULT b'0' COMMENT '删除标记',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_account_no` (`account_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='账户表';

-- 收入记录表
CREATE TABLE IF NOT EXISTS `finance_in` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `in_no` VARCHAR(50) NOT NULL COMMENT '收入单号',
    `in_type` INT NOT NULL DEFAULT '1' COMMENT '收入类型: 1-销售收款 2-退款 3-其他收入',
    `account_id` BIGINT NOT NULL COMMENT '账户ID',
    `amount` DECIMAL(18,2) NOT NULL COMMENT '金额',
    `order_type` VARCHAR(20) DEFAULT NULL COMMENT '来源单据类型',
    `order_id` BIGINT DEFAULT NULL COMMENT '来源单据ID',
    `order_no` VARCHAR(50) DEFAULT NULL COMMENT '来源单据号',
    `customer_id` BIGINT DEFAULT NULL COMMENT '客户ID',
    `status` INT NOT NULL DEFAULT '1' COMMENT '状态: 1-待审核 2-已审核 3-已取消',
    `auditor_id` BIGINT DEFAULT NULL COMMENT '审核人ID',
    `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` BIT(1) DEFAULT b'0' COMMENT '删除标记',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_in_no` (`in_no`),
    KEY `idx_account_id` (`account_id`),
    KEY `idx_order` (`order_type`, `order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收入记录表';

-- 支出记录表
CREATE TABLE IF NOT EXISTS `finance_out` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `out_no` VARCHAR(50) NOT NULL COMMENT '支出单号',
    `out_type` INT NOT NULL DEFAULT '1' COMMENT '支出类型: 1-采购付款 2-退款 3-其他支出',
    `account_id` BIGINT NOT NULL COMMENT '账户ID',
    `amount` DECIMAL(18,2) NOT NULL COMMENT '金额',
    `order_type` VARCHAR(20) DEFAULT NULL COMMENT '来源单据类型',
    `order_id` BIGINT DEFAULT NULL COMMENT '来源单据ID',
    `order_no` VARCHAR(50) DEFAULT NULL COMMENT '来源单据号',
    `supplier_id` BIGINT DEFAULT NULL COMMENT '供应商ID',
    `status` INT NOT NULL DEFAULT '1' COMMENT '状态: 1-待审核 2-已审核 3-已取消',
    `auditor_id` BIGINT DEFAULT NULL COMMENT '审核人ID',
    `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` BIT(1) DEFAULT b'0' COMMENT '删除标记',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_out_no` (`out_no`),
    KEY `idx_account_id` (`account_id`),
    KEY `idx_order` (`order_type`, `order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支出记录表';

-- 账户交易记录表
CREATE TABLE IF NOT EXISTS `account_transaction` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `account_id` BIGINT NOT NULL COMMENT '账户ID',
    `account_no` VARCHAR(50) DEFAULT NULL COMMENT '账户编号',
    `trans_type` INT NOT NULL COMMENT '交易类型: 1-收款入账 2-付款出账 3-调整增加 4-调整减少',
    `amount` DECIMAL(18,2) NOT NULL COMMENT '交易金额',
    `ref_id` BIGINT DEFAULT NULL COMMENT '相关单据ID',
    `ref_no` VARCHAR(50) DEFAULT NULL COMMENT '相关单据号',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `creator_id` BIGINT DEFAULT NULL COMMENT '经手人ID',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` BIT(1) DEFAULT b'0' COMMENT '删除标记',
    PRIMARY KEY (`id`),
    KEY `idx_account_id` (`account_id`),
    KEY `idx_ref` (`ref_type`, `ref_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='账户交易记录表';