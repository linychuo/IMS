-- 移除 source 列，所有权限统一对待
ALTER TABLE sys_permission DROP COLUMN IF EXISTS source;