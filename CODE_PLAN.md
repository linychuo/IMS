# IMS 进销存系统 - 代码开发计划

> **版本**: v1.0  
> **日期**: 2025-05-02  
> **状态**: 规划中

---

## 一、当前进度总览

### 1.1 已完成模块

| 模块 | 子模块 | 状态 | 说明 |
|------|--------|------|------|
| ims-core | 基础框架 | ✅ | BaseEntity, Result, PageResult, MyBatisPlusConfig |
| ims-product | 商品管理 | ✅ | Product Entity, Mapper, Service, Controller |
| ims-supplier | 供应商管理 | ✅ | Supplier Entity, Mapper, Service, Controller |
| ims-customer | 客户管理 | ✅ | Customer Entity, Mapper, Service, Controller |
| ims-warehouse | 仓库管理 | ✅ | Warehouse, Location Entity, Mapper, Service, Controller |
| ims-purchase | 采购订单 | ✅ | PurchaseOrder, PurchaseOrderItem Entity, Mapper |
| ims-purchase | 采购入库 | ✅ | PurchaseIn, PurchaseInItem Entity, Mapper, Service, Controller |
| ims-sales | 销售订单 | 🟡 | SalesOrder Entity, Mapper (待完善) |
| ims-sales | 销售出库 | 🟡 | SalesOut, SalesOutItem Entity (待完善) |

### 1.2 待开发模块

| 模块 | 状态 | 优先级 |
|------|------|--------|
| ims-inventory | 🆕 | P0 |
| ims-finance | 🆕 | P1 |
| ims-report | 🆕 | P2 |
| ims-system | 🆕 | P1 |

---

## 二、开发计划

### 2.1 Phase 1: MVP 核心功能 (Week 1-2)

#### Week 1: 库存模块 (ims-inventory)

**目标**: 实现出入库、库存台账、库位管理

```
Week 1 任务清单
├── 1.1 库存台账
│   ├── Inventory Entity (商品ID, 仓库ID, 库位ID, 数量, 批次号)
│   ├── InventoryMapper / XML
│   ├── InventoryService / Impl
│   └── InventoryController
├── 1.2 入库管理
│   ├── InventoryIn Entity (采购入库、其他入库)
│   ├── InventoryInDetail Entity
│   ├── InventoryInMapper / XML
│   ├── InventoryInService / Impl
│   └── InventoryInController
├── 1.3 出库管理
│   ├── InventoryOut Entity (销售出库、其他出库)
│   ├── InventoryOutDetail Entity
│   ├── InventoryOutMapper / XML
│   ├── InventoryOutService / Impl
│   └── InventoryOutController
└── 1.4 库存流水
    ├── InventoryRecord Entity (变动记录)
    ├── InventoryRecordMapper / XML
    └── InventoryRecordService (自动记录出入库)
```

**数据库表设计**:

```sql
-- 库存台账表
CREATE TABLE inventory (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL COMMENT '商品ID',
    warehouse_id BIGINT NOT NULL COMMENT '仓库ID',
    location_id BIGINT COMMENT '库位ID',
    quantity DECIMAL(18,4) DEFAULT 0 COMMENT '库存数量',
    frozen_quantity DECIMAL(18,4) DEFAULT 0 COMMENT '冻结数量',
    cost DECIMAL(18,4) DEFAULT 0 COMMENT '成本单价',
    batch_no VARCHAR(50) COMMENT '批次号',
    production_date DATE COMMENT '生产日期',
    expiry_date DATE COMMENT '有效期',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 库存变动记录表
CREATE TABLE inventory_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    warehouse_id BIGINT NOT NULL,
    location_id BIGINT,
    change_type VARCHAR(20) NOT NULL COMMENT 'IN/OUT/ADJUST',
    change_quantity DECIMAL(18,4) NOT NULL,
    before_quantity DECIMAL(18,4) NOT NULL,
    after_quantity DECIMAL(18,4) NOT NULL,
    order_type VARCHAR(20) COMMENT 'PURCHASE_IN/SALES_OUT等',
    order_id BIGINT COMMENT '关联单据ID',
    batch_no VARCHAR(50),
    remark VARCHAR(500),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Week 2: 采购销售完善 + 库存联动

```
Week 2 任务清单
├── 2.1 采购入库联动库存
│   ├── 修改 PurchaseInServiceImpl
│   │   入库时自动增加库存台账数量
│   │   自动生成 InventoryRecord
│   └── PurchaseInController 添加库存相关返回
├── 2.2 销售出库联动库存
│   ├── 完善 SalesOut (Entity, Mapper, Service)
│   ├── SalesOutServiceImpl
│   │   扣减库存 + 预占库存处理
│   │   自动生成 InventoryRecord
│   └── SalesOutController
├── 2.3 采购订单完善
│   ├── PurchaseOrderServiceImpl
│   └── PurchaseOrderController 审核/取消
└── 2.4 销售订单完善
    ├── SalesOrderServiceImpl
    └── SalesOrderController 审核/取消/预占库存
```

---

### 2.2 Phase 2: 业务扩展 (Week 3-4)

#### Week 3: 财务管理 (ims-finance)

**目标**: 应收应付、收款付款

```
Week 3 任务清单
├── 3.1 应收账款
│   ├── Receivable Entity
│   ├── ReceivableMapper / XML
│   ├── ReceivableService / Impl
│   └── ReceivableController
├── 3.2 应付账款
│   ├── Payable Entity
│   ├── PayableMapper / XML
│   ├── PayableService / Impl
│   └── PayableController
├── 3.3 收款管理
│   ├── Receipt Entity
│   ├── ReceiptMapper / XML
│   ├── ReceiptService / Impl
│   └── ReceiptController
├── 3.4 付款管理
│   └── Payment Entity, Mapper, Service, Controller
└── 3.5 自动生成应收应付
    ├── 采购入库自动生成应付账款
    ├── 销售出库自动生成应收账款
    └── 收款/付款核销功能
```

**数据库表设计**:

```sql
-- 应收账款表
CREATE TABLE receivable (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    order_type VARCHAR(20) NOT NULL COMMENT 'SALES_OUT',
    order_id BIGINT NOT NULL,
    order_amount DECIMAL(18,4) NOT NULL COMMENT '订单金额',
    received_amount DECIMAL(18,4) DEFAULT 0 COMMENT '已收金额',
    pending_amount DECIMAL(18,4) NOT NULL COMMENT '待收金额',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT 'PENDING/PARTIAL/COMPLETED',
    due_date DATE COMMENT '到期日',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME
);

-- 收款记录表
CREATE TABLE receipt (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    receipt_amount DECIMAL(18,4) NOT NULL,
    receipt_method VARCHAR(20) COMMENT 'CASH/WECHAT/ALIPAY/BANK',
    receipt_time DATETIME NOT NULL,
    order_type VARCHAR(20),
    order_id BIGINT COMMENT '关联订单',
    remark VARCHAR(500),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Week 4: 系统管理 (ims-system)

**目标**: 用户、角色、权限

```
Week 4 任务清单
├── 4.1 用户管理
│   ├── SysUser Entity
│   ├── SysUserMapper / XML
│   ├── SysUserService / Impl
│   └── SysUserController
├── 4.2 角色管理
│   ├── SysRole Entity
│   ├── SysRoleMapper / XML
│   ├── SysRoleService / Impl
│   └── SysRoleController
├── 4.3 权限管理
│   ├── SysPermission Entity
│   ├── SysPermissionMapper / XML
│   └── 注解式权限控制
├── 4.4 操作日志
│   ├── SysLog Entity
│   ├── SysLogMapper
│   └── 自动记录增删改操作
└── 4.5 数据字典
    ├── SysDict Entity
    └── 通用下拉选项
```

---

### 2.3 Phase 3: 高级功能 (Week 5-6)

#### Week 5: 盘点与调拨

```
Week 5 任务清单
├── 5.1 盘点管理
│   ├── CheckOrder Entity
│   ├── CheckOrderDetail Entity
│   ├── CheckOrderService / Impl
│   └── 盘点盈亏自动调整库存
├── 5.2 调拨管理
│   ├── Transfer Order Entity
│   ├── TransferOrderDetail Entity
│   ├── TransferService / Impl
│   └── 调拨出库+调拨入库联动
└── 5.3 批次管理
    ├── 批次号生成规则
    └── 先进先出(FIFO)出库建议
```

#### Week 6: 报表中心

```
Week 6 任务清单
├── 6.1 销售报表
│   ├── SalesReportController
│   ├── 销售额统计
│   ├── 客户销售排行
│   └── 商品销售排行
├── 6.2 采购报表
│   ├── PurchaseReportController
│   ├── 采购额统计
│   └── 供应商采购排行
├── 6.3 库存报表
│   ├── InventoryReportController
│   ├── 库存余额统计
│   ├── 库存预警(低于安全库存)
│   └── 临期商品预警
└── 6.4 经营概览
    └── Dashboard 数据聚合
```

---

## 三、技术架构

### 3.1 技术栈

| 层级 | 技术 |
|------|------|
| 后端框架 | Spring Boot 3.x |
| ORM | MyBatis Plus 3.5 |
| 数据库 | MySQL 8.0 |
| 安全 | Spring Security + JWT |
| 文档 | Knife4j (Swagger) |
| 日志 | Lombok + SLF4J |

### 3.2 项目结构

```
ims/
├── pom.xml                    # 父 POM
├── ims-core/                  # 公共模块
│   └── src/main/java/.../
├── ims-product/               # 商品模块
├── ims-supplier/              # 供应商模块
├── ims-customer/              # 客户模块
├── ims-warehouse/             # 仓库模块
├── ims-purchase/               # 采购模块
├── ims-sales/                 # 销售模块
├── ims-inventory/             # 库存模块
├── ims-finance/               # 财务模块
├── ims-system/                # 系统模块
└── ims-report/                # 报表模块
```

### 3.3 模块依赖关系

```
ims-core
  ↑
  ├─ ims-product
  ├─ ims-supplier
  ├─ ims-customer
  ├─ ims-warehouse
  ├─ ims-purchase ──────────► ims-inventory
  │                              ▲
  ├─ ims-sales ──────────────────┤
  │                              │
  ├─ ims-finance ◄───────────────┤
  │                              │
  ├─ ims-system                  │
  └─ ims-report ◄───────────────┘
```

---

## 四、API 设计规范

### 4.1 RESTful URL 规范

| 资源 | GET | POST | PUT | DELETE |
|------|-----|------|-----|--------|
| /products | 列表 | 新增 | 批量更新 | - |
| /products/{id} | 详情 | - | 更新 | 删除 |
| /products/{id}/enable | - | 启用 | - | - |

### 4.2 响应格式

```json
// 成功
{
  "code": 200,
  "message": "success",
  "data": {}
}

// 分页
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [],
    "total": 100,
    "page": 1,
    "size": 10
  }
}

// 失败
{
  "code": 400,
  "message": "参数错误",
  "data": null
}
```

---

## 五、开发规范

### 5.1 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| Entity | 表名 | Product, PurchaseOrder |
| Mapper | Entity + Mapper | ProductMapper |
| Service | Entity + Service | ProductService |
| Controller | 资源名复数 | ProductsController |
| DAO | 已包含在 Mapper 中 | - |

### 5.2 代码要求

1. **Entity**: 使用 MyBatis Plus @TableName 注解
2. **Mapper**: 继承 BaseMapper，提供 XML 配置
3. **Service**: 接口+实现类，事务注解
4. **Controller**: RESTful API，参数校验
5. **DTO**: 请求/响应对象分离

---

## 六、里程碑

| 阶段 | 完成时间 | 交付物 |
|------|----------|--------|
| MVP | Week 2 结束 | 采购、销售、库存核心功能 |
| 完整版 | Week 4 结束 | 财务、系统功能 |
| 增强版 | Week 6 结束 | 盘点、调拨、报表 |

---

## 七、后续规划

### v2.0 特性 (计划)

- [ ] 微信小程序移动端
- [ ] 条码扫码出入库
- [ ] 低库存预警通知
- [ ] 多仓库管理
- [ ] 客户信用额度控制
- [ ] 供应商价格协议

### v3.0 特性 (规划)

- [ ] AI 智能采购建议
- [ ] 销量预测
- [ ] 自动补货提醒
- [ ] 电商平台对接
- [ ] 财务对账自动化

---

**文档版本历史**

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| v1.0 | 2025-05-02 | 初稿创建 |

---

*本计划基于需求文档制定，可根据实际开发进度调整。*