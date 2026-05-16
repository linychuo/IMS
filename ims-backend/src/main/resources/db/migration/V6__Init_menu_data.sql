-- 初始化菜单数据 (source='MANUAL' 不会被 PermissionScanner 覆盖)
-- 先将已有的菜单标记为 MANUAL
UPDATE sys_permission SET source = 'MANUAL' WHERE deleted = 0 AND source IS NULL;

-- 顶级菜单 - 使用 ON CONFLICT 确保幂等性
INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
VALUES ('dashboard', '仪表盘', NULL, '/dashboard', 0, 1, 0, 'MANUAL')
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', path = EXCLUDED.path, sort_order = EXCLUDED.sort_order, permission_name = EXCLUDED.permission_name;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
VALUES ('report', '报表中心', NULL, '/report', 1, 1, 0, 'MANUAL')
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', path = EXCLUDED.path, sort_order = EXCLUDED.sort_order, permission_name = EXCLUDED.permission_name;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
VALUES ('warehouse', '仓库管理', NULL, '/warehouse', 2, 1, 0, 'MANUAL')
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', path = EXCLUDED.path, sort_order = EXCLUDED.sort_order, permission_name = EXCLUDED.permission_name;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
VALUES ('product', '商品管理', NULL, '/product', 3, 1, 0, 'MANUAL')
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', path = EXCLUDED.path, sort_order = EXCLUDED.sort_order, permission_name = EXCLUDED.permission_name;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
VALUES ('customer', '客户管理', NULL, '/customer', 4, 1, 0, 'MANUAL')
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', path = EXCLUDED.path, sort_order = EXCLUDED.sort_order, permission_name = EXCLUDED.permission_name;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
VALUES ('supplier', '供应商管理', NULL, '/supplier', 5, 1, 0, 'MANUAL')
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', path = EXCLUDED.path, sort_order = EXCLUDED.sort_order, permission_name = EXCLUDED.permission_name;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
VALUES ('sales', '销售管理', NULL, '/sales/order', 6, 1, 0, 'MANUAL')
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', path = EXCLUDED.path, sort_order = EXCLUDED.sort_order, permission_name = EXCLUDED.permission_name;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
VALUES ('purchase', '采购管理', NULL, '/purchase/order', 7, 1, 0, 'MANUAL')
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', path = EXCLUDED.path, sort_order = EXCLUDED.sort_order, permission_name = EXCLUDED.permission_name;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
VALUES ('inventory', '库存管理', NULL, '/inventory/account', 8, 1, 0, 'MANUAL')
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', path = EXCLUDED.path, sort_order = EXCLUDED.sort_order, permission_name = EXCLUDED.permission_name;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
VALUES ('finance', '财务管理', NULL, '/finance/account', 9, 1, 0, 'MANUAL')
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', path = EXCLUDED.path, sort_order = EXCLUDED.sort_order, permission_name = EXCLUDED.permission_name;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
VALUES ('system', '系统管理', NULL, '/system', 10, 1, 0, 'MANUAL')
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', path = EXCLUDED.path, sort_order = EXCLUDED.sort_order, permission_name = EXCLUDED.permission_name;

-- 二级菜单
INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'report:dashboard', '报表中心', id, '/report/dashboard', 0, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'report'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'warehouse:warehouse', '仓库管理', id, '/warehouse', 0, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'warehouse'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'warehouse:location', '库位管理', id, '/warehouse/location', 1, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'warehouse'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'sales:order', '销售订单', id, '/sales/order', 0, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'sales'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'sales:out', '销售出库', id, '/sales/out', 1, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'sales'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'sales:return', '销售退货', id, '/sales/return', 2, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'sales'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'sales:price-strategy', '价格策略', id, '/sales/price-strategy', 3, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'sales'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'purchase:order', '采购订单', id, '/purchase/order', 0, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'purchase'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'purchase:in', '采购入库', id, '/purchase/in', 1, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'purchase'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'purchase:return', '采购退货', id, '/purchase/return', 2, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'purchase'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'inventory:account', '账本查询', id, '/inventory/account', 0, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'inventory'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'inventory:in', '入库记录', id, '/inventory/in', 1, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'inventory'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'inventory:out', '出库记录', id, '/inventory/out', 2, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'inventory'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'inventory:transfer', '库存调拨', id, '/inventory/transfer', 3, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'inventory'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'inventory:check', '库存盘点', id, '/inventory/check', 4, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'inventory'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'inventory:record', '盘点记录', id, '/inventory/record', 5, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'inventory'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'finance:in', '收款记录', id, '/finance/in', 0, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'finance'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'finance:out', '付款记录', id, '/finance/out', 1, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'finance'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'finance:account', '账户管理', id, '/finance/account', 2, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'finance'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'finance:receivable', '应收账款', id, '/finance/receivable', 3, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'finance'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'finance:payable', '应付账款', id, '/finance/payable', 4, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'finance'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;

INSERT INTO sys_permission (permission_code, permission_name, parent_id, path, sort_order, status, deleted, source)
SELECT 'finance:transaction', '交易记录', id, '/finance/transaction', 5, 1, 0, 'MANUAL'
FROM sys_permission WHERE permission_code = 'finance'
ON CONFLICT (permission_code) DO UPDATE SET source = 'MANUAL', parent_id = EXCLUDED.parent_id, path = EXCLUDED.path;