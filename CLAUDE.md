# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IMS (Inventory Management System) is a full-stack Java/React application for managing inventory, sales, procurement, finance, and customer relationships. The system uses Spring Boot 3.2.5 + MyBatis Plus on the backend and React 18 + Vite + Ant Design on the frontend.

## Build Commands

### Backend (ims-backend)
```bash
cd ims-backend
mvn spring-boot:run -DskipTests    # Start backend (port 8080)
mvn clean package                    # Build JAR
```

### Frontend (ims-frontend)
```bash
cd ims-frontend
npm install                          # Install dependencies
npm run dev                          # Start dev server (port 3000)
npm run build                        # Production build
npm run lint                         # Lint code
```

## Architecture

### Backend Structure
```
ims-backend/src/main/java/com/ims/
├── core/           # Shared infrastructure (Result, BaseEntity, configs)
├── common/         # Utilities, enums, DTOs
├── system/         # System module: auth, users, roles, permissions, menus
├── sales/         # Sales module: orders, outbound, returns, price strategies
├── inventory/     # Inventory module: accounts, inbound/outbound, transfers, checks
├── procurement/   # Procurement module
├── warehouse/     # Warehouse module
├── finance/       # Finance module: accounts, transactions, receivables/payables
├── customer/      # Customer module
├── product/       # Product module
├── report/        # Report module
```

### Permission System
The system uses a homegrown permission model driven by `@Permission` annotation:
- Controller classes annotated with `@Permission(code = "module:entity", name = "菜单名")` define menu-level permissions
- Methods annotated with `@Permission(code = "action", name = "操作名")` define button-level permissions
- Final permission code = class code + ":" + method code (e.g., `system:user:read`)
- **PermissionScanner** (runs on startup) automatically syncs annotations → `sys_permission` table

### Frontend Structure
```
ims-frontend/src/
├── api/index.ts          # Axios instances per domain (authApi, systemApi, salesApi, etc.)
├── stores/authStore.ts   # Zustand store for auth state (token, user, menus, permissions)
├── router.tsx            # React Router with permission-aware routes
├── pages/                # Page components (dashboard, sales, inventory, finance, etc.)
├── components/           # Shared components (RequirePermission, PermissionWrapper)
└── hooks/usePermission.ts # Permission checking hook
```

### Frontend-Backend API Pattern
- `authApi` and `systemApi` hit `http://localhost:8080` directly
- Other APIs (salesApi, purchaseApi, etc.) hit `http://localhost:8080/api`
- JWT token stored in localStorage and sent as `Authorization: Bearer <token>` header

## Database

PostgreSQL 14+. Schema initialized via `ims-backend/src/main/resources/db/init.sql`. Contains ~50 tables including:
- `sys_user`, `sys_role`, `sys_permission`, `sys_menu` — core permission system
- Business tables per module (sales_order, inventory_account, etc.)

Default login: `admin` / `admin123`

## Key Patterns

- All backend responses wrap in `Result<T>` with `{code, message, data}`
- Entities extend `BaseEntity` which provides `id`, `createTime`, `updateTime`, `deleted` (soft delete via MyBatis Plus `@TableLogic`)
- Frontend uses Zustand for auth state, React Router for navigation
- Frontend permission checking via `<RequirePermission>` component or `usePermission` hook