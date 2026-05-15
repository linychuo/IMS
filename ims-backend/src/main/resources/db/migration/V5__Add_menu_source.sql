-- Add source column to distinguish auto-scanned vs manually maintained permissions
ALTER TABLE sys_permission ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'AUTO';