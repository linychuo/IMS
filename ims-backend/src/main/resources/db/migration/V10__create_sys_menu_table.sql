-- 创建栏目表
CREATE TABLE sys_menu (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    path VARCHAR(200),
    parent_id BIGINT,
    component VARCHAR(200),
    sort_order INTEGER DEFAULT 0,
    description VARCHAR(500),
    status INTEGER DEFAULT 1,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    FOREIGN KEY (parent_id) REFERENCES sys_menu(id)
);

-- 迁移现有栏目数据（parentId=null 且有 path 的）
INSERT INTO sys_menu (id, name, path, parent_id, component, sort_order, description, status, create_time, update_time, deleted)
SELECT id, permission_name, path, parent_id, component, sort_order, description, status, create_time, update_time, deleted
FROM sys_permission
WHERE (parent_id IS NULL AND path IS NOT NULL) OR parent_id IN (
    SELECT id FROM sys_permission WHERE parent_id IS NULL AND path IS NOT NULL
);

-- 迁移所有有 path 的记录（包括子栏目）
INSERT INTO sys_menu (id, name, path, parent_id, component, sort_order, description, status, create_time, update_time, deleted)
SELECT id, permission_name, path, parent_id, component, sort_order, description, status, create_time, update_time, deleted
FROM sys_permission
WHERE path IS NOT NULL AND id NOT IN (SELECT id FROM sys_menu);

-- 创建栏目-权限关联表（如果还不存在）
CREATE TABLE IF NOT EXISTS sys_menu_permission (
    id BIGSERIAL PRIMARY KEY,
    menu_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (menu_id) REFERENCES sys_menu(id),
    FOREIGN KEY (permission_id) REFERENCES sys_permission(id),
    UNIQUE(menu_id, permission_id)
);

-- 从 sys_menu_permission 迁移已有数据（如果有关联数据）
-- 这一步可选，取决于是否有现有数据需要迁移