-- IMS 测试数据初始化脚本
-- 使用方法: PGPASSWORD=postgres psql -U postgres -d ims -f init-test-data.sql

-- ========== 1. 基础数据 ==========

-- 添加仓库
INSERT INTO warehouse (warehouse_code, warehouse_name, warehouse_type, address, manager, phone, status, create_time, update_time, deleted)
VALUES
('WH001', '北京中心仓', 1, '北京市朝阳区某某路123号', '张三', '13800138001', 1, NOW(), NOW(), 0),
('WH002', '上海中心仓', 1, '上海市浦东新区某某大道456号', '李四', '13800138002', 1, NOW(), NOW(), 0);

-- 添加库位
INSERT INTO inv_location (location_code, location_name, warehouse_id, remark, status, create_time, update_time, deleted)
SELECT 'A01', 'A区01架', id, '测试库位', 1, NOW(), NOW(), 0 FROM warehouse WHERE warehouse_code = 'WH001';

-- 添加商品分类
INSERT INTO product_category (category_code, category_name, level, status, create_time, update_time, deleted)
VALUES ('CAT001', '电子产品', 1, 1, NOW(), NOW(), 0);

-- 添加商品
INSERT INTO product (product_code, product_name, category_id, unit, spec, barcode, purchase_price, sale_price, min_sale_price, cost, min_stock, status, create_time, update_time, deleted)
SELECT 'P001', 'iPhone 15 手机', id, '台', '128GB', '6901234567890', 5000, 6999, 5999, 4800, 10, 1, NOW(), NOW(), 0 FROM product_category WHERE category_code = 'CAT001';

INSERT INTO product (product_code, product_name, category_id, unit, spec, purchase_price, sale_price, min_sale_price, cost, min_stock, status, create_time, update_time, deleted)
SELECT 'P002', 'MacBook Pro 笔记本电脑', id, '台', '14英寸 M3', 12000, 15999, 13999, 11500, 5, 1, NOW(), NOW(), 0 FROM product_category WHERE category_code = 'CAT001';

-- 添加计量单位
INSERT INTO unit_of_measure (unit_code, unit_name, type, ratio, status, create_time, update_time, deleted)
VALUES ('UNIT001', '箱', 2, 12, 1, NOW(), NOW(), 0);

-- ========== 2. 客户和供应商 ==========

-- 添加客户
INSERT INTO customer (customer_code, customer_name, contact, phone, mobile, address, email, status, create_time, update_time, deleted)
VALUES
('C001', '北京科技有限公司', '王五', '010-12345678', '13900139001', '北京市海淀区某某大街100号', 'contact@example.com', 1, NOW(), NOW(), 0),
('C002', '上海贸易公司', '赵六', '021-87654321', '13900139002', '上海市浦东新区某某路200号', NULL, 1, NOW(), NOW(), 0);

-- 添加供应商
INSERT INTO supplier (supplier_code, supplier_name, contact, phone, address, status, create_time, update_time, deleted)
VALUES
('S001', '深圳科技有限公司', '刘七', '0755-88888888', '深圳市南山区某某路200号', 1, NOW(), NOW(), 0),
('S002', '广州电子公司', '陈八', '020-11112222', '广州市天河区某某大道100号', 1, NOW(), NOW(), 0);

-- ========== 3. 财务数据 ==========

-- 添加账户
INSERT INTO account (account_name, account_type, bank_name, bank_account, balance, status, create_time, update_time, deleted)
VALUES ('工商银行基本户', 1, '工商银行北京分行', '6222021234567890123', 100000, 1, NOW(), NOW(), 0);

-- 添加收款记录
WITH cust AS (SELECT id FROM customer WHERE customer_code = 'C001' LIMIT 1)
INSERT INTO finance_in (in_no, customer_id, amount, pay_date, bank_name, remark, status, create_time, update_time, deleted)
SELECT 'FIN-IN-001', id, 50000, '2026-05-30', '工商银行', '预收货款', 1, NOW(), NOW(), 0 FROM cust;

-- 添加付款记录
WITH supp AS (SELECT id FROM supplier WHERE supplier_code = 'S001' LIMIT 1)
INSERT INTO finance_out (out_no, supplier_id, amount, pay_date, bank_name, remark, status, create_time, update_time, deleted)
SELECT 'FIN-OUT-001', id, 30000, '2026-05-30', '工商银行', '预付货款', 1, NOW(), NOW(), 0 FROM supp;

-- ========== 4. 销售采购订单 ==========

-- 添加销售订单
WITH cust AS (SELECT id FROM customer WHERE customer_code = 'C001' LIMIT 1)
INSERT INTO sales_order (order_no, customer_id, order_date, status, total_amount, create_time, update_time, deleted)
SELECT 'SO2026053001', id, '2026-05-30', 1, 34995, NOW(), NOW(), 0 FROM cust;

WITH cust AS (SELECT id FROM customer WHERE customer_code = 'C001' LIMIT 1)
INSERT INTO sales_order (order_no, customer_id, order_date, status, total_amount, create_time, update_time, deleted)
SELECT 'SO2026053002', id, '2026-05-30', 1, 79995, NOW(), NOW(), 0 FROM cust;

-- 添加采购订单
WITH supp AS (SELECT id FROM supplier WHERE supplier_code = 'S001' LIMIT 1)
INSERT INTO purchase_order (order_no, supplier_id, order_date, status, total_amount, create_time, update_time, deleted)
SELECT 'PO2026053001', id, '2026-05-30', 1, 50000, NOW(), NOW(), 0 FROM supp;

WITH supp AS (SELECT id FROM supplier WHERE supplier_code = 'S001' LIMIT 1)
INSERT INTO purchase_order (order_no, supplier_id, order_date, status, total_amount, create_time, update_time, deleted)
SELECT 'PO2026053002', id, '2026-05-30', 1, 120000, NOW(), NOW(), 0 FROM supp;

-- ========== 5. 库存记录 ==========

-- 入库记录
WITH wh AS (SELECT id FROM warehouse WHERE warehouse_code = 'WH001' LIMIT 1)
INSERT INTO inventory_in (in_no, warehouse_id, in_date, status, total_amount, create_time, update_time, deleted)
SELECT 'IN2026053001', id, '2026-05-30', 1, 250000, NOW(), NOW(), 0 FROM wh;

WITH wh AS (SELECT id FROM warehouse WHERE warehouse_code = 'WH001' LIMIT 1)
INSERT INTO inventory_in (in_no, warehouse_id, in_date, status, total_amount, create_time, update_time, deleted)
SELECT 'IN2026053002', id, '2026-05-30', 1, 120000, NOW(), NOW(), 0 FROM wh;

-- 出库记录
WITH wh AS (SELECT id FROM warehouse WHERE warehouse_code = 'WH001' LIMIT 1)
INSERT INTO inventory_out (out_no, warehouse_id, out_date, status, total_amount, create_time, update_time, deleted)
SELECT 'OUT2026053001', id, '2026-05-30', 1, 34995, NOW(), NOW(), 0 FROM wh;

WITH wh AS (SELECT id FROM warehouse WHERE warehouse_code = 'WH001' LIMIT 1)
INSERT INTO inventory_out (out_no, warehouse_id, out_date, status, total_amount, create_time, update_time, deleted)
SELECT 'OUT2026053002', id, '2026-05-30', 1, 159990, NOW(), NOW(), 0 FROM wh;

-- ========== 6. 业务单据 ==========

DO $$
DECLARE
  wh_id bigint;
  prod_id bigint;
  cust_id bigint;
  supp_id bigint;
  so_id bigint;
  po_id bigint;
BEGIN
  SELECT id INTO wh_id FROM warehouse WHERE warehouse_code = 'WH001' LIMIT 1;
  SELECT id INTO prod_id FROM product WHERE product_code = 'P001' LIMIT 1;
  SELECT id INTO cust_id FROM customer WHERE customer_code = 'C001' LIMIT 1;
  SELECT id INTO supp_id FROM supplier WHERE supplier_code = 'S001' LIMIT 1;
  SELECT id INTO so_id FROM sales_order WHERE order_no = 'SO2026053001' LIMIT 1;
  SELECT id INTO po_id FROM purchase_order WHERE order_no = 'PO2026053001' LIMIT 1;

  -- 当前库存
  INSERT INTO inventory (product_id, warehouse_id, quantity, frozen_quantity, cost, product_name, product_code, warehouse_name, create_time, update_time, deleted)
  VALUES (prod_id, wh_id, 45, 0, 4800, 'iPhone 15 手机', 'P001', '北京中心仓', NOW(), NOW(), 0);

  -- 销售出库单
  INSERT INTO sales_out (out_no, order_id, order_no, customer_id, customer_name, out_date, warehouse_id, warehouse_name, status, total_amount, create_time, update_time, deleted)
  VALUES ('OUT2026053003', so_id, 'SO2026053001', cust_id, '北京科技有限公司', '2026-05-30', wh_id, '北京中心仓', 1, 34995, NOW(), NOW(), 0);

  INSERT INTO sales_out_detail (out_id, product_id, product_name, spec, unit, quantity, price, amount, create_time, update_time, deleted)
  VALUES ((SELECT id FROM sales_out WHERE out_no = 'OUT2026053003'), prod_id, 'iPhone 15 手机', '128GB', '台', 5, 6999, 34995, NOW(), NOW(), 0);

  -- 销售退货单
  INSERT INTO sales_return (return_no, order_id, order_no, out_id, out_no, customer_id, customer_name, return_date, warehouse_id, warehouse_name, status, total_amount, create_time, update_time, deleted)
  VALUES ('RET2026053001', so_id, 'SO2026053001', (SELECT id FROM sales_out WHERE out_no = 'OUT2026053003'), 'OUT2026053003', cust_id, '北京科技有限公司', '2026-05-30', wh_id, '北京中心仓', 1, 6999, NOW(), NOW(), 0);

  -- 采购入库单
  INSERT INTO purchase_in (in_no, order_id, order_no, supplier_id, supplier_name, in_date, warehouse_id, warehouse_name, status, total_amount, create_time, update_time, deleted)
  VALUES ('PIN2026053001', po_id, 'PO2026053001', supp_id, '深圳科技有限公司', '2026-05-30', wh_id, '北京中心仓', 1, 50000, NOW(), NOW(), 0);

  INSERT INTO purchase_in_detail (in_id, product_id, product_name, spec, unit, quantity, price, amount, create_time, update_time, deleted)
  VALUES ((SELECT id FROM purchase_in WHERE in_no = 'PIN2026053001'), prod_id, 'iPhone 15 手机', '128GB', '台', 10, 5000, 50000, NOW(), NOW(), 0);

  -- 采购退货单
  INSERT INTO purchase_return (return_no, purchase_in_id, purchase_in_no, supplier_id, supplier_name, return_date, warehouse_id, warehouse_name, status, total_amount, refund_amount, create_time, update_time, deleted)
  VALUES ('PRET2026053001', (SELECT id FROM purchase_in WHERE in_no = 'PIN2026053001'), 'PIN2026053001', supp_id, '深圳科技有限公司', '2026-05-30', wh_id, '北京中心仓', 1, 5000, 0, NOW(), NOW(), 0);

  -- 库存调拨单
  INSERT INTO inventory_transfer (transfer_no, from_warehouse_id, from_warehouse_name, to_warehouse_id, to_warehouse_name, transfer_date, status, total_amount, create_time, update_time, deleted)
  VALUES ('TRF2026053001', wh_id, '北京中心仓', wh_id, '北京中心仓', '2026-05-30', 1, 0, NOW(), NOW(), 0);

  -- 库存盘点单
  INSERT INTO inventory_check (check_no, warehouse_id, warehouse_name, check_date, status, create_time, update_time, deleted)
  VALUES ('CHK2026053001', wh_id, '北京中心仓', '2026-05-30', 1, NOW(), NOW(), 0);

  -- 质检单
  INSERT INTO quality_check (check_no, order_type, order_id, order_no, warehouse_id, warehouse_name, supplier_id, supplier_name, check_time, status, create_time, update_time, deleted)
  VALUES ('QC2026053001', 'PURCHASE_IN', (SELECT id FROM purchase_in WHERE in_no = 'PIN2026053001'), 'PIN2026053001', wh_id, '北京中心仓', supp_id, '深圳科技有限公司', NOW(), 1, NOW(), NOW(), 0);

  -- 促销
  INSERT INTO promotion (promotion_no, promotion_name, promotion_type, discount_type, discount_value, start_date, end_date, status, create_time, update_time, deleted)
  VALUES ('PROMO001', 'iPhone 15 首销优惠', 1, 2, 10, '2026-05-01', '2026-06-30', 1, NOW(), NOW(), 0);

  -- 价格策略
  INSERT INTO sales_price_strategy (strategy_no, strategy_name, product_id, product_name, price_type, price, start_date, end_date, status, create_time, update_time, deleted)
  VALUES ('SPS001', 'iPhone 15 批发价', prod_id, 'iPhone 15 手机', 2, 5500, '2026-05-01', '2026-12-31', 1, NOW(), NOW(), 0);

  -- 应收
  INSERT INTO receivable (receivable_no, customer_id, order_type, order_id, order_no, total_amount, paid_amount, pending_amount, due_date, status, create_time, update_time, deleted)
  VALUES ('REC2026053001', cust_id, 'SALES_ORDER', so_id, 'SO2026053001', 34995, 0, 34995, '2026-06-30', 1, NOW(), NOW(), 0);

  -- 应付
  INSERT INTO payable (payable_no, supplier_id, order_type, order_id, order_no, total_amount, paid_amount, pending_amount, due_date, status, create_time, update_time, deleted)
  VALUES ('PAY2026053001', supp_id, 'PURCHASE_ORDER', po_id, 'PO2026053001', 50000, 0, 50000, '2026-06-30', 1, NOW(), NOW(), 0);
END $$;

-- ========== 验证数据 ==========
SELECT '仓库' as tbl, count(*) as cnt FROM warehouse UNION ALL
SELECT '库位', count(*) FROM inv_location UNION ALL
SELECT '商品', count(*) FROM product UNION ALL
SELECT '商品分类', count(*) FROM product_category UNION ALL
SELECT '计量单位', count(*) FROM unit_of_measure UNION ALL
SELECT '客户', count(*) FROM customer UNION ALL
SELECT '供应商', count(*) FROM supplier UNION ALL
SELECT '账户', count(*) FROM account UNION ALL
SELECT '收款记录', count(*) FROM finance_in UNION ALL
SELECT '付款记录', count(*) FROM finance_out UNION ALL
SELECT '销售订单', count(*) FROM sales_order UNION ALL
SELECT '销售出库', count(*) FROM sales_out UNION ALL
SELECT '销售退货', count(*) FROM sales_return UNION ALL
SELECT '采购订单', count(*) FROM purchase_order UNION ALL
SELECT '采购入库', count(*) FROM purchase_in UNION ALL
SELECT '采购退货', count(*) FROM purchase_return UNION ALL
SELECT '入库记录', count(*) FROM inventory_in UNION ALL
SELECT '出库记录', count(*) FROM inventory_out UNION ALL
SELECT '当前库存', count(*) FROM inventory UNION ALL
SELECT '库存调拨', count(*) FROM inventory_transfer UNION ALL
SELECT '库存盘点', count(*) FROM inventory_check UNION ALL
SELECT '质检单', count(*) FROM quality_check UNION ALL
SELECT '促销', count(*) FROM promotion UNION ALL
SELECT '价格策略', count(*) FROM sales_price_strategy UNION ALL
SELECT '应收', count(*) FROM receivable UNION ALL
SELECT '应付', count(*) FROM payable;