# IMS 系统部署指南

## 环境要求

| 组件 | 版本 |
|------|------|
| Java | 21 |
| Node.js | 18+ |
| PostgreSQL | 14+ |
| Maven | 3.8+ |

---

## 一、数据库初始化

### 1.1 创建数据库

```bash
sudo -u postgres psql -c "CREATE DATABASE ims;"
```

### 1.2 执行初始化脚本

```bash
cd /home/ivan/IMS/ims-backend/src/main/resources/db
psql -U postgres -d ims -f init.sql
```

**说明**：`init.sql` 是合并后的完整脚本，包含：
- 删除所有现有表和序列
- 创建所有系统表、业务表（50+ 张表）
- 初始化菜单数据（sys_menu）
- 创建管理员账户

**注意**：此脚本会清空所有现有数据，请仅在全新数据库上执行。

### 1.3 验证初始化

```bash
psql -U postgres -d ims -c "SELECT COUNT(*) FROM sys_menu; SELECT COUNT(*) FROM sys_user; SELECT COUNT(*) FROM sys_permission;"
```

预期结果：
- sys_menu: 32 条记录
- sys_user: 1 条记录
- sys_permission: 172 条记录（PermissionScanner 启动时自动扫描生成）

**注意**：PermissionScanner 会根据 Controller 的 `@Permission` 注解自动创建权限数据，首次启动后端后会自动生成。

---

## 二、启动后端

### 2.1 编译并启动

```bash
cd /home/ivan/IMS/ims-backend
mvn spring-boot:run -DskipTests
```

启动后访问 `http://localhost:8080`

**启动说明**：
- PermissionScanner 会在启动时自动扫描 Controller 的 `@Permission` 注解
- 权限数据写入 `sys_permission` 表
- 业务表会在首次访问时自动创建（如果有配置）

---

## 三、启动前端

```bash
cd /home/ivan/IMS/ims-frontend
npm install
npm run dev
```

前端运行在 `http://localhost:3000`

---

## 四、登录

**默认账户**：
- 用户名：`admin`
- 密码：`admin123`

### 命令行验证

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

成功响应：
```json
{
  "code": 200,
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "userId": 1,
    "username": "admin",
    "realName": "系统管理员",
    "menus": [{"id":2,"name":"报表中心","path":"/report","children":[...]}, ...],
    "permissions": ["system:user:read", "system:user:create", ...]
  }
}
```

---

## 五、目录结构说明

```
ims-backend/src/main/resources/db/
├── init.sql                    # 合并后的完整初始化脚本（推荐）
└── migration/                 # 旧版迁移脚本（已废弃）
    ├── V1__Initial_schema.sql
    ├── V2__Business_tables.sql
    ├── V3__Full_schema.sql
    └── ...

ims-frontend/
├── src/
│   └── pages/                  # 页面组件
└── package.json
```

---

## 六、常见问题处理

### 6.1 登录报错 "用户名或密码错误"

**原因**：密码哈希不匹配

**解决方法**：
```sql
psql -U postgres -d ims -c "UPDATE sys_user SET password = '\$2a\$10\$TJVeU7ICPLNSniCpH.trOe7lvr5mStSUU3A63J34Ti/X0Okb3DsQO' WHERE username = 'admin';"
```

### 6.2 权限数据丢失或 menus 为空

**原因**：sys_role_permission 或 sys_menu_permission 表未初始化

**解决方法**：
```sql
-- 分配所有权限给管理员角色
INSERT INTO sys_role_permission (role_id, permission_id)
SELECT r.id, p.id FROM sys_role r, sys_permission p WHERE r.role_code = 'admin' AND p.deleted = 0;

-- 分配栏目权限关联
INSERT INTO sys_menu_permission (menu_id, permission_id)
SELECT m.id, p.id FROM sys_menu m
JOIN sys_permission p ON (
    p.permission_code = SUBSTRING(m.path FROM 2)
    OR p.permission_code = REPLACE(SUBSTRING(m.path FROM 2), '/', ':')
)
WHERE m.deleted = 0 AND p.deleted = 0;
```
然后重启后端。

**说明**：init.sql 已包含上述初始化语句，如启动后仍有问题可手动执行。

### 6.3 端口被占用

前端会自动选择其他端口，如 3001、3002 等。

---

## 七、技术栈

| 组件 | 技术 |
|------|------|
| 后端框架 | Spring Boot 3.2.5 |
| ORM | MyBatis Plus 3.5.5 |
| 数据库 | PostgreSQL |
| 安全 | Spring Security + JWT |
| 前端框架 | React 18 + Vite |
| UI 库 | Ant Design 5.x |

---

## 八、一键部署脚本

```bash
#!/bin/bash
set -e

# 1. 创建数据库
sudo -u postgres psql -c "DROP DATABASE IF EXISTS ims;"
sudo -u postgres psql -c "CREATE DATABASE ims;"

# 2. 执行初始化脚本
cd /home/ivan/IMS/ims-backend/src/main/resources/db
psql -U postgres -d ims -f init.sql

# 3. 启动后端
cd /home/ivan/IMS/ims-backend
mvn spring-boot:run -DskipTests &
BACKEND_PID=$!

# 4. 启动前端
cd /home/ivan/IMS/ims-frontend
npm run dev &
FRONTEND_PID=$!

echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "访问 http://localhost:3000"
echo "用户: admin / admin123"

# 等待
wait
```