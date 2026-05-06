-- =============================================
-- 库存模块数据库表
-- =============================================

-- 库存台账表
CREATE TABLE IF NOT EXISTS `inventory` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `product_id` BIGINT NOT NULL COMMENT '商品ID',
    `warehouse_id` BIGINT NOT NULL COMMENT '仓库ID',
    `location_id` BIGINT DEFAULT NULL COMMENT '库位ID',
    `quantity` DECIMAL(18,4) DEFAULT '0.0000' COMMENT '库存数量',
    `frozen_quantity` DECIMAL(18,4) DEFAULT '0.0000' COMMENT '冻结数量',
    `cost` DECIMAL(18,4) DEFAULT '0.0000' COMMENT '成本单价',
    `batch_no` VARCHAR(50) DEFAULT NULL COMMENT '批次号',
    `production_date` DATE DEFAULT NULL COMMENT '生产日期',
    `expiry_date` DATE DEFAULT NULL COMMENT '有效期',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` BIT(1) DEFAULT b'0' COMMENT '删除标记',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_product_warehouse_location_batch` (`product_id`, `warehouse_id`, `location_id`, `batch_no`),
    KEY `idx_product_id` (`product_id`),
    KEY `idx_warehouse_id` (`warehouse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='库存台账表';

-- 入库单表
CREATE TABLE IF NOT EXISTS `inventory_in` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `in_no` VARCHAR(50) NOT NULL COMMENT '入库单号',
    `in_type` INT NOT NULL DEFAULT '1' COMMENT '入库类型: 1-采购入库 2-其他入库',
    `warehouse_id` BIGINT NOT NULL COMMENT '仓库ID',
    `source_id` BIGINT DEFAULT NULL COMMENT '来源单据ID',
    `source_type` VARCHAR(20) DEFAULT NULL COMMENT '来源类型: PURCHASE_IN',
    `total_amount` DECIMAL(18,2) DEFAULT '0.00' COMMENT '总金额',
    `status` INT NOT NULL DEFAULT '1' COMMENT '状态: 1-待审核 2-已审核 3-已取消',
    `auditor_id` BIGINT DEFAULT NULL COMMENT '审核人ID',
    `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` BIT(1) DEFAULT b'0' COMMENT '删除标记',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_in_no` (`in_no`),
    KEY `idx_warehouse_id` (`warehouse_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='入库单表';

-- 入库明细表
CREATE TABLE IF NOT EXISTS `inventory_in_detail` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `in_id` BIGINT NOT NULL COMMENT '入库单ID',
    `product_id` BIGINT NOT NULL COMMENT '商品ID',
    `location_id` BIGINT DEFAULT NULL COMMENT '库位ID',
    `quantity` DECIMAL(18,4) NOT NULL COMMENT '数量',
    `price` DECIMAL(18,4) DEFAULT '0.0000' COMMENT '单价',
    `amount` DECIMAL(18,2) DEFAULT '0.00' COMMENT '金额',
    `batch_no` VARCHAR(50) DEFAULT NULL COMMENT '批次号',
    `production_date` VARCHAR(20) DEFAULT NULL COMMENT '生产日期',
    `expiry_date` VARCHAR(20) DEFAULT NULL COMMENT '有效期',
    `remark` VARCHAR(200) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` BIT(1) DEFAULT b'0' COMMENT '删除标记',
    PRIMARY KEY (`id`),
    KEY `idx_in_id` (`in_id`),
    KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='入库明细表';

-- 出库单表
CREATE TABLE IF NOT EXISTS `inventory_out` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `out_no` VARCHAR(50) NOT NULL COMMENT '出库单号',
    `out_type` INT NOT NULL DEFAULT '1' COMMENT '出库类型: 1-销售出库 2-其他出库',
    `warehouse_id` BIGINT NOT NULL COMMENT '仓库ID',
    `source_id` BIGINT DEFAULT NULL COMMENT '来源单据ID',
    `source_type` VARCHAR(20) DEFAULT NULL COMMENT '来源类型: SALES_OUT',
    `total_amount` DECIMAL(18,2) DEFAULT '0.00' COMMENT '总金额',
    `status` INT NOT NULL DEFAULT '1' COMMENT '状态: 1-待审核 2-已审核 3-已取消',
    `auditor_id` BIGINT DEFAULT NULL COMMENT '审核人ID',
    `audit_time` DATETIME DEFAULT NULL COMMENT '审核时间',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` BIT(1) DEFAULT b'0' COMMENT '删除标记',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_out_no` (`out_no`),
    KEY `idx_warehouse_id` (`warehouse_id`),
    KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='出库单表';

-- 出库明细表
CREATE TABLE IF NOT EXISTS `inventory_out_detail` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `out_id` BIGINT NOT NULL COMMENT '出库单ID',
    `product_id` BIGINT NOT NULL COMMENT '商品ID',
    `location_id` BIGINT DEFAULT NULL COMMENT '库位ID',
    `quantity` DECIMAL(18,4) NOT NULL COMMENT '数量',
    `price` DECIMAL(18,4) DEFAULT '0.0000' COMMENT '单价',
    `amount` DECIMAL(18,2) DEFAULT '0.00' COMMENT '金额',
    `batch_no` VARCHAR(50) DEFAULT NULL COMMENT '批次号',
    `remark` VARCHAR(200) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted` BIT(1) DEFAULT b'0' COMMENT '删除标记',
    PRIMARY KEY (`id`),
    KEY `idx_out_id` (`out_id`),
    KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='出库明细表';

-- 库存变动记录表
CREATE TABLE IF NOT EXISTS `inventory_record` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
    `product_id` BIGINT NOT NULL COMMENT '商品ID',
    `warehouse_id` BIGINT NOT NULL COMMENT '仓库ID',
    `location_id` BIGINT DEFAULT NULL COMMENT '库位ID',
    `change_type` VARCHAR(20) NOT NULL COMMENT '变动类型: IN/OUT/ADJUST/FREEZE/UNFREEZE',
    `change_quantity` DECIMAL(18,4) NOT NULL COMMENT '变动数量',
    `before_quantity` DECIMAL(18,4) NOT NULL COMMENT '变动前数量',
    `after_quantity` DECIMAL(18,4) NOT NULL COMMENT '变动后数量',
    `order_type` VARCHAR(20) DEFAULT NULL COMMENT '来源单据类型',
    `order_id` BIGINT DEFAULT NULL COMMENT '关联单据ID',
    `order_detail_id` BIGINT DEFAULT NULL COMMENT '关联明细ID',
    `batch_no` VARCHAR(50) DEFAULT NULL COMMENT '批次号',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `deleted` BIT(1) DEFAULT b'0' COMMENT '删除标记',
    PRIMARY KEY (`id`),
    KEY `idx_product_id` (`product_id`),
    KEY `idx_warehouse_id` (`warehouse_id`),
    KEY `idx_order` (`order_type`, `order_id`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='库存变动记录表';