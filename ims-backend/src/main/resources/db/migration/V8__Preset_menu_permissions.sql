-- 预置栏目权限点关联数据
-- 为每个栏目预分配其业务相关的权限点

-- 仓库管理 (199) - 仓库和库位权限
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (199, 340) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (199, 59) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (199, 74) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (199, 91) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (199, 291) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (199, 286) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (199, 287) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (199, 288) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (199, 289) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (199, 290) ON CONFLICT DO NOTHING;

-- 商品管理 (188) - 商品和分类权限
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (188, 345) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (188, 54) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (188, 87) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (188, 145) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (188, 166) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (188, 271) ON CONFLICT DO NOTHING;

-- 客户管理 (198) - 客户权限
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (198, 274) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (198, 104) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (198, 130) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (198, 139) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (198, 158) ON CONFLICT DO NOTHING;

-- 供应商管理 (198) - 供应商权限
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (198, 198) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (198, 214) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (198, 215) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (198, 254) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (198, 265) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (198, 267) ON CONFLICT DO NOTHING;

-- 销售管理 (189) - 销售订单、出库、退货、价格策略
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (189, 224) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (189, 262) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (189, 221) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (189, 268) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (189, 243) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (189, 235) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (189, 241) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (189, 110) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (189, 234) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (189, 53) ON CONFLICT DO NOTHING;

-- 采购管理 (185) - 采购订单、入库、退货
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (185, 342) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (185, 233) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (185, 240) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (185, 246) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (185, 256) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (185, 260) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (185, 216) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (185, 236) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (185, 250) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (185, 242) ON CONFLICT DO NOTHING;

-- 库存管理 (186) - 入库、出库、盘点、调拨、记录
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (186, 232) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (186, 228) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (186, 257) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (186, 261) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (186, 208) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (186, 205) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (186, 213) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (186, 210) ON CONFLICT DO NOTHING;

-- 财务管理 (194) - 收款、付款、账户、应收、应付
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (194, 79) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (194, 95) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (194, 92) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (194, 132) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (194, 195) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (194, 196) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (194, 181) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (194, 90) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (194, 102) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (194, 112) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (194, 82) ON CONFLICT DO NOTHING;

-- 报表中心 (293)
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (293, 346) ON CONFLICT DO NOTHING;

-- 系统管理 (193) - 用户管理
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (193, 344) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (193, 106) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (193, 55) ON CONFLICT DO NOTHING;

-- 栏目管理 (304) - 栏目权限
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (304, 298) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (304, 301) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (304, 302) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (304, 300) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (304, 297) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (304, 299) ON CONFLICT DO NOTHING;
INSERT INTO sys_menu_permission (menu_id, permission_id) VALUES (304, 296) ON CONFLICT DO NOTHING;