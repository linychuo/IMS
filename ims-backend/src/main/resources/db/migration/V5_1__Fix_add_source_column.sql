-- 修复：添加 source 列（V5 迁移遗漏）
ALTER TABLE sys_permission ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'AUTO';