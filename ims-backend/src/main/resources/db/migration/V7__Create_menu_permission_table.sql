-- 栏目权限关联表（栏目与权限点多对多）
CREATE TABLE IF NOT EXISTS sys_menu_permission (
    id BIGSERIAL PRIMARY KEY,
    menu_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_menu_permission UNIQUE (menu_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_menu_permission_menu ON sys_menu_permission(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_permission_perm ON sys_menu_permission(permission_id);

COMMENT ON TABLE sys_menu_permission IS '栏目权限关联表';
COMMENT ON COLUMN sys_menu_permission.menu_id IS '栏目ID';
COMMENT ON COLUMN sys_menu_permission.permission_id IS '权限点ID';