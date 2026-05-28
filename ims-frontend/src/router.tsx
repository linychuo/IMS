import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import AppLayout from './layouts/AppLayout';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ProductPage from './pages/product/Product';
import { RequirePermission } from './components/RequirePermission';

// 懒加载页面（非首屏必需）
const UnitOfMeasurePage = lazy(() => import('./pages/product/UnitOfMeasure'));
const WarehousePage = lazy(() => import('./pages/warehouse/Warehouse'));
const CustomerPage = lazy(() => import('./pages/customer/Customer'));
const SupplierPage = lazy(() => import('./pages/purchase/Supplier'));
const SalesOrderPage = lazy(() => import('./pages/sales/SalesOrder'));
const SalesOutPage = lazy(() => import('./pages/sales/SalesOut'));
const SalesReturnPage = lazy(() => import('./pages/sales/SalesReturn'));
const SalesPriceStrategyPage = lazy(() => import('./pages/sales/SalesPriceStrategy'));
const SalesOrderTrackPage = lazy(() => import('./pages/sales/SalesOrderTrack'));
const PromotionPage = lazy(() => import('./pages/sales/Promotion'));
const CustomerReconciliationPage = lazy(() => import('./pages/finance/CustomerReconciliation'));
const SupplierReconciliationPage = lazy(() => import('./pages/finance/SupplierReconciliation'));
const PurchaseOrderPage = lazy(() => import('./pages/purchase/PurchaseOrder'));
const PurchaseOrderTrackPage = lazy(() => import('./pages/purchase/PurchaseOrderTrack'));
const PurchaseInPage = lazy(() => import('./pages/purchase/PurchaseIn'));
const PurchaseAlertPage = lazy(() => import('./pages/purchase/PurchaseAlert'));
const PurchaseReturnPage = lazy(() => import('./pages/purchase/PurchaseReturn'));
const PriceAgreementPage = lazy(() => import('./pages/purchase/PriceAgreement'));
const InventoryAccountPage = lazy(() => import('./pages/inventory/InventoryAccount'));
const InventoryInPage = lazy(() => import('./pages/inventory/InventoryIn'));
const InventoryOutPage = lazy(() => import('./pages/inventory/InventoryOut'));
const InventoryTransferPage = lazy(() => import('./pages/inventory/InventoryTransfer'));
const InventoryCheckPage = lazy(() => import('./pages/inventory/InventoryCheck'));
const InventoryRecordPage = lazy(() => import('./pages/inventory/InventoryRecord'));
const BatchPage = lazy(() => import('./pages/inventory/Batch'));
const BarcodePage = lazy(() => import('./pages/inventory/Barcode'));
const InventoryAlertPage = lazy(() => import('./pages/inventory/InventoryAlert'));
const QualityCheckPage = lazy(() => import('./pages/inventory/QualityCheck'));
const FinanceInPage = lazy(() => import('./pages/finance/FinanceIn'));
const FinanceOutPage = lazy(() => import('./pages/finance/FinanceOut'));
const AccountPage = lazy(() => import('./pages/finance/Account'));
const ReceivablePage = lazy(() => import('./pages/finance/Receivable'));
const PayablePage = lazy(() => import('./pages/finance/Payable'));
const TransactionPage = lazy(() => import('./pages/finance/Transaction'));
const InvoicePage = lazy(() => import('./pages/finance/Invoice'));
const ExpensePage = lazy(() => import('./pages/finance/Expense'));
const SystemPage = lazy(() => import('./pages/system/System'));
const ConfigPage = lazy(() => import('./pages/system/Config'));
const NotificationPage = lazy(() => import('./pages/system/Notification'));
const PrintTemplatePage = lazy(() => import('./pages/system/PrintTemplate'));
const DocumentNoRulePage = lazy(() => import('./pages/system/DocumentNoRule'));
const BackupPage = lazy(() => import('./pages/system/Backup'));
const ApprovalRulePage = lazy(() => import('./pages/system/ApprovalRule'));
const ReportPage = lazy(() => import('./pages/report/Report'));
const PredictionPage = lazy(() => import('./pages/report/Prediction'));

// 懒加载包装组件
function LazyWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div style={{ padding: 24, textAlign: 'center' }}>加载中...</div>}>{children}</Suspense>;
}

// 路由权限映射
const routePermissionMap: Record<string, string> = {
  '/dashboard': 'report:dashboard',
  '/report': 'report:dashboard',
  '/report/prediction': 'report:prediction',
  '/warehouse': 'warehouse',
  '/warehouse/location': 'warehouse:warehouse:location',
  '/product': 'product:category',
  '/product/unit-of-measure': 'product:unitOfMeasure',
  '/customer': 'customer:customer',
  '/supplier': 'supplier',
  '/sales/order': 'sales:order',
  '/sales/out': 'sales:out',
  '/sales/return': 'sales:return',
  '/sales/strategy': 'sales:price-strategy',
  '/sales/price-strategy': 'sales:price-strategy',
  '/sales/track': 'sales:order',
  '/sales/promotion': 'sales:promotion',
  '/purchase/order': 'purchase:order',
  '/purchase/track': 'purchase:order',
  '/purchase/alert': 'purchase:order',
  '/purchase/in': 'purchase:in',
  '/purchase/return': 'purchase:return',
  '/purchase/price-agreement': 'procurement:price-agreement',
  '/inventory/account': 'inventory',
  '/inventory/in': 'inventory:in',
  '/inventory/out': 'inventory:out',
  '/inventory/transfer': 'inventory:transfer',
  '/inventory/check': 'inventory:check',
  '/inventory/record': 'inventory:record',
  '/inventory/batch': 'inventory:record',
  '/inventory/barcode': 'inventory:record',
  '/inventory/alert': 'inventory:record',
  '/inventory/quality-check': 'inventory:check',
  '/finance/in': 'finance',
  '/finance/out': 'finance',
  '/finance/account': 'finance',
  '/finance/receivable': 'finance:receivable',
  '/finance/payable': 'finance:payable',
  '/finance/transaction': 'finance',
  '/finance/invoice': 'finance:invoice',
  '/finance/expense': 'finance:expense',
  '/finance/customer-reconciliation': 'finance:customerReconciliation',
  '/finance/supplier-reconciliation': 'finance:supplierReconciliation',
  '/system': 'system:menu',
  '/system/user': 'system:user',
  '/system/config': 'system:config',
  '/system/document-no-rule': 'system:documentNoRule',
  '/system/backup': 'system:backup',
  '/system/approval-rule': 'system:approvalRule',
  '/system/notification': 'system:notification',
  '/system/print-template': 'system:printTemplate',
  '/role': 'system:role',
};

// 带权限控制的路由组件
function PermissionRoute({ path, element }: { path: string; element: React.ReactNode }) {
  const code = routePermissionMap[path];
  if (code) {
    return (
      <RequirePermission codes={[code]}>
        {element}
      </RequirePermission>
    );
  }
  return <>{element}</>;
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <PermissionRoute path="/dashboard" element={<Dashboard />} /> },
      { path: 'product', element: <PermissionRoute path="/product" element={<ProductPage />} /> },
      { path: 'product/unit-of-measure', element: <LazyWrapper><PermissionRoute path="/product/unit-of-measure" element={<UnitOfMeasurePage />} /></LazyWrapper> },
      { path: 'warehouse', element: <LazyWrapper><PermissionRoute path="/warehouse" element={<WarehousePage />} /></LazyWrapper> },
      { path: 'warehouse/location', element: <LazyWrapper><PermissionRoute path="/warehouse" element={<WarehousePage defaultTab="location" />} /></LazyWrapper> },
      { path: 'customer', element: <LazyWrapper><PermissionRoute path="/customer" element={<CustomerPage />} /></LazyWrapper> },
      { path: 'supplier', element: <LazyWrapper><PermissionRoute path="/supplier" element={<SupplierPage />} /></LazyWrapper> },
      { path: 'sales/order', element: <LazyWrapper><PermissionRoute path="/sales/order" element={<SalesOrderPage />} /></LazyWrapper> },
      { path: 'sales/out', element: <LazyWrapper><PermissionRoute path="/sales/out" element={<SalesOutPage />} /></LazyWrapper> },
      { path: 'sales/return', element: <LazyWrapper><PermissionRoute path="/sales/return" element={<SalesReturnPage />} /></LazyWrapper> },
      { path: 'sales/strategy', element: <LazyWrapper><PermissionRoute path="/sales/strategy" element={<SalesPriceStrategyPage />} /></LazyWrapper> },
      { path: 'sales/price-strategy', element: <LazyWrapper><PermissionRoute path="/sales/price-strategy" element={<SalesPriceStrategyPage />} /></LazyWrapper> },
      { path: 'sales/track', element: <LazyWrapper><PermissionRoute path="/sales/track" element={<SalesOrderTrackPage />} /></LazyWrapper> },
      { path: 'sales/promotion', element: <LazyWrapper><PermissionRoute path="/sales/promotion" element={<PromotionPage />} /></LazyWrapper> },
      { path: 'purchase/order', element: <LazyWrapper><PermissionRoute path="/purchase/order" element={<PurchaseOrderPage />} /></LazyWrapper> },
      { path: 'purchase/track', element: <LazyWrapper><PermissionRoute path="/purchase/track" element={<PurchaseOrderTrackPage />} /></LazyWrapper> },
      { path: 'purchase/alert', element: <LazyWrapper><PermissionRoute path="/purchase/alert" element={<PurchaseAlertPage />} /></LazyWrapper> },
      { path: 'purchase/in', element: <LazyWrapper><PermissionRoute path="/purchase/in" element={<PurchaseInPage />} /></LazyWrapper> },
      { path: 'purchase/return', element: <LazyWrapper><PermissionRoute path="/purchase/return" element={<PurchaseReturnPage />} /></LazyWrapper> },
      { path: 'purchase/price-agreement', element: <LazyWrapper><PermissionRoute path="/purchase/price-agreement" element={<PriceAgreementPage />} /></LazyWrapper> },
      { path: 'inventory/account', element: <LazyWrapper><PermissionRoute path="/inventory/account" element={<InventoryAccountPage />} /></LazyWrapper> },
      { path: 'inventory/in', element: <LazyWrapper><PermissionRoute path="/inventory/in" element={<InventoryInPage />} /></LazyWrapper> },
      { path: 'inventory/out', element: <LazyWrapper><PermissionRoute path="/inventory/out" element={<InventoryOutPage />} /></LazyWrapper> },
      { path: 'inventory/transfer', element: <LazyWrapper><PermissionRoute path="/inventory/transfer" element={<InventoryTransferPage />} /></LazyWrapper> },
      { path: 'inventory/check', element: <LazyWrapper><PermissionRoute path="/inventory/check" element={<InventoryCheckPage />} /></LazyWrapper> },
      { path: 'inventory/record', element: <LazyWrapper><PermissionRoute path="/inventory/record" element={<InventoryRecordPage />} /></LazyWrapper> },
      { path: 'inventory/batch', element: <LazyWrapper><PermissionRoute path="/inventory/batch" element={<BatchPage />} /></LazyWrapper> },
      { path: 'inventory/barcode', element: <LazyWrapper><PermissionRoute path="/inventory/barcode" element={<BarcodePage />} /></LazyWrapper> },
      { path: 'inventory/alert', element: <LazyWrapper><PermissionRoute path="/inventory/alert" element={<InventoryAlertPage />} /></LazyWrapper> },
      { path: 'inventory/quality-check', element: <LazyWrapper><PermissionRoute path="/inventory/quality-check" element={<QualityCheckPage />} /></LazyWrapper> },
      { path: 'finance/in', element: <LazyWrapper><PermissionRoute path="/finance/in" element={<FinanceInPage />} /></LazyWrapper> },
      { path: 'finance/out', element: <LazyWrapper><PermissionRoute path="/finance/out" element={<FinanceOutPage />} /></LazyWrapper> },
      { path: 'finance/account', element: <LazyWrapper><PermissionRoute path="/finance/account" element={<AccountPage />} /></LazyWrapper> },
      { path: 'finance/receivable', element: <LazyWrapper><PermissionRoute path="/finance/receivable" element={<ReceivablePage />} /></LazyWrapper> },
      { path: 'finance/payable', element: <LazyWrapper><PermissionRoute path="/finance/payable" element={<PayablePage />} /></LazyWrapper> },
      { path: 'finance/transaction', element: <LazyWrapper><PermissionRoute path="/finance/transaction" element={<TransactionPage />} /></LazyWrapper> },
      { path: 'finance/invoice', element: <LazyWrapper><PermissionRoute path="/finance/invoice" element={<InvoicePage />} /></LazyWrapper> },
      { path: 'finance/expense', element: <LazyWrapper><PermissionRoute path="/finance/expense" element={<ExpensePage />} /></LazyWrapper> },
      { path: 'finance/customer-reconciliation', element: <LazyWrapper><PermissionRoute path="/finance/customer-reconciliation" element={<CustomerReconciliationPage />} /></LazyWrapper> },
      { path: 'finance/supplier-reconciliation', element: <LazyWrapper><PermissionRoute path="/finance/supplier-reconciliation" element={<SupplierReconciliationPage />} /></LazyWrapper> },
      { path: 'system', element: <LazyWrapper><PermissionRoute path="/system" element={<SystemPage defaultTab="user" />} /></LazyWrapper> },
      { path: 'system/user', element: <LazyWrapper><PermissionRoute path="/system" element={<SystemPage defaultTab="user" />} /></LazyWrapper> },
      { path: 'system/config', element: <LazyWrapper><PermissionRoute path="/system/config" element={<ConfigPage />} /></LazyWrapper> },
      { path: 'system/notification', element: <LazyWrapper><PermissionRoute path="/system/notification" element={<NotificationPage />} /></LazyWrapper> },
      { path: 'system/print-template', element: <LazyWrapper><PermissionRoute path="/system/print-template" element={<PrintTemplatePage />} /></LazyWrapper> },
      { path: 'system/document-no-rule', element: <LazyWrapper><PermissionRoute path="/system/document-no-rule" element={<DocumentNoRulePage />} /></LazyWrapper> },
      { path: 'system/backup', element: <LazyWrapper><PermissionRoute path="/system/backup" element={<BackupPage />} /></LazyWrapper> },
      { path: 'system/approval-rule', element: <LazyWrapper><PermissionRoute path="/system/approval-rule" element={<ApprovalRulePage />} /></LazyWrapper> },
      { path: 'role', element: <LazyWrapper><PermissionRoute path="/system" element={<SystemPage defaultTab="role" />} /></LazyWrapper> },
      { path: 'report', element: <LazyWrapper><PermissionRoute path="/report" element={<ReportPage />} /></LazyWrapper> },
      { path: 'report/dashboard', element: <LazyWrapper><PermissionRoute path="/report" element={<ReportPage />} /></LazyWrapper> },
      { path: 'report/prediction', element: <LazyWrapper><PermissionRoute path="/report/prediction" element={<PredictionPage />} /></LazyWrapper> },
    ],
  },
]);