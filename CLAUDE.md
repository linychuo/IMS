# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IMS (Inventory Management System) is a Maven multi-module enterprise application implementing a Chinese "进销存" (Purchasing-Sales-Inventory) system using Spring Boot 3.x with MyBatis Plus.

## Build Commands

```bash
mvn clean install        # Build all modules
mvn clean package        # Package
mvn test                 # Run tests
```

## Architecture

### Multi-Module Structure

- **ims-core** - BaseController, Result, PageResult, MyBatisPlusConfig
- **ims-common** - Shared entities (BaseEntity), DTOs, enums, utilities
- **ims-product, ims-supplier, ims-customer, ims-warehouse** - Master data modules
- **ims-purchase** - Procurement (MySQL)
- **ims-procurement** - Procurement service (PostgreSQL, runs on port 8081)
- **ims-sales** - Sales service (MySQL, runs on port 8080)
- **ims-inventory** - Inventory management (in progress)
- **ims-finance, ims-report** - Planned modules
- **ims-system** - User, Role, Permission management with Spring Security + JWT

### Module Dependency Graph

```
ims-core
  ↑
  ├─ ims-product, ims-supplier, ims-customer, ims-warehouse
  ├─ ims-purchase ──────────► ims-inventory
  │                              ▲
  ├─ ims-sales ──────────────────┤
  ├─ ims-finance ◄───────────────┤
  └─ ims-report ◄────────────────┘
```

### Layered Architecture Per Module

```
controller/  (REST APIs)
service/     (Business logic, interface + impl)
mapper/      (Data access, MyBatis interface)
entity/      (Domain models)
dto/         (Request/Response objects)
```

### Key Technical Details

- **Java 21** with **Spring Boot 3.2.5**
- **ORM**: MyBatis Plus 3.5.7 with XML mapper files in `src/main/resources/mapper/`
- **Databases**: MySQL (most modules), PostgreSQL (ims-procurement)
- **Authentication**: JWT via Spring Security in ims-system
- **API docs**: Knife4j/Swagger

### Important Conventions

1. **BaseEntity**: Two different base entities exist:
   - `ims-common` uses JPA annotations with UUID
   - `ims-core` uses MyBatis Plus with Long id

2. **Response format**: Standard `Result<T>` wrapper with `code`, `message`, `data`

3. **Pagination**: Use `PageResult<T>` from ims-core

4. **Transaction management**: Add `@Transactional` on Service implementation methods

5. **DTO mapping**: Use MapStruct for entity-DTO conversions

## Configuration

- `ims-core/src/main/resources/application.yml` - MySQL config (localhost:3306/ims)
- `ims-procurement/src/main/resources/application.yml` - PostgreSQL config
- Database SQL schemas in `/db/` directory

## Running Individual Services

Three modules have main application classes and run as separate Spring Boot apps:
- `ims-procurement` on port 8081
- `ims-sales` on port 8080
- `ims-report` on port 8085