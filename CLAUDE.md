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
├── system/         # System module: auth, users, roles, permissions, menus, backup
├── sales/         # Sales module: orders, outbound, returns, price strategies
├── inventory/     # Inventory module: accounts, inbound/outbound, transfers, checks
├── procurement/   # Procurement module
├── warehouse/     # Warehouse module
├── finance/       # Finance module: accounts, transactions, receivables/payables
├── customer/      # Customer module
├── product/       # Product module (includes unit of measure)
├── report/        # Report module (includes AI prediction)
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
├── router.tsx            # React Router with lazy-loaded routes
├── pages/                # Page components (dashboard, sales, inventory, finance, etc.)
├── components/           # Shared components (RequirePermission, PermissionWrapper)
└── hooks/usePermission.ts # Permission checking hook
```

### Frontend-Backend API Pattern
- `authApi` and `systemApi` hit `http://localhost:8080` directly
- Other APIs (salesApi, purchaseApi, etc.) hit `http://localhost:8080/api`
- JWT token stored in localStorage and sent as `Authorization: Bearer <token>` header

## Database

PostgreSQL 14+. Schema initialized via `ims-backend/src/main/resources/db/init.sql`. Contains ~60 tables including:
- `sys_user`, `sys_role`, `sys_permission`, `sys_menu` — core permission system
- Business tables per module (sales_order, inventory_account, etc.)
- `unit_of_measure` —计量单位管理
- `document_no_rule` —单据编号规则配置
- `backup_record` —数据备份记录
- `prediction_config` —AI预测配置

Default login: `admin` / `admin123`

## Key Patterns

- All backend responses wrap in `Result<T>` with `{code, message, data}`
- Entities extend `BaseEntity` which provides `id`, `createTime`, `updateTime`, `deleted` (soft delete via MyBatis Plus `@TableLogic`)
- Frontend uses Zustand for auth state, React Router for navigation
- Frontend permission checking via `<RequirePermission>` component or `usePermission` hook

## New Features (Recently Implemented)

### 1. Unit of Measure (计量单位管理)
- Path: `/product/unit-of-measure`
- Backend: `product:unitOfMeasure` permission
- Features: Basic/Auxiliary units, conversion ratios

### 2. Document Number Rules (单据编号规则)
- Path: `/system/document-no-rule`
- Backend: `system:documentNoRule` permission
- Features: Configurable prefix, date format, sequence length, reset frequency

### 3. Backup & Restore (数据备份恢复)
- Path: `/system/backup`
- Backend: `system:backup` permission
- Features: Full/incremental backup using pg_dump, restore functionality

### 4. AI Prediction (AI智能预测)
- Path: `/report/prediction`
- Backend: `report:prediction` permission
- Features: Sales forecasting (exponential smoothing), purchase suggestions, inventory alerts

### 5. Approval Rules (审批规则配置)
- Path: `/system/approval-rule`
- Backend: `system:approvalRule` permission
- Features: Multi-level approval based on amount thresholds

## Performance Optimizations

- Database indexes added for: receivable, payable, writeoff_record, inventory, sales_out, purchase_in, orders
- Frontend lazy loading via React.lazy + Suspense for all non-dashboard routes

## Security Notes

- CORS restricted to localhost:3000 and localhost:5173
- Password reset generates random 8-character passwords
- Exception details are logged but not exposed to clients
- Empty catch blocks include warning logs