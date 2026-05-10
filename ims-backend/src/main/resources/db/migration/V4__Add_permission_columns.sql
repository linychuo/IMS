-- Add missing columns to sys_permission table for dynamic permission system
ALTER TABLE sys_permission ADD COLUMN IF NOT EXISTS permission_type VARCHAR(20) DEFAULT 'button';
ALTER TABLE sys_permission ADD COLUMN IF NOT EXISTS path VARCHAR(200);
ALTER TABLE sys_permission ADD COLUMN IF NOT EXISTS component VARCHAR(200);
ALTER TABLE sys_permission ADD COLUMN IF NOT EXISTS icon VARCHAR(50);
ALTER TABLE sys_permission ADD COLUMN IF NOT EXISTS description VARCHAR(500);
ALTER TABLE sys_permission ADD COLUMN IF NOT EXISTS status INTEGER DEFAULT 1;
ALTER TABLE sys_permission ADD COLUMN IF NOT EXISTS create_by BIGINT;
ALTER TABLE sys_permission ADD COLUMN IF NOT EXISTS update_by BIGINT;