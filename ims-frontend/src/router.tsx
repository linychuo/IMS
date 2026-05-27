import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ProductPage from './pages/product/Product';
import WarehousePage from './pages/warehouse/Warehouse';
import CustomerPage from './pages/customer/Customer';
import SupplierPage from './pages/purchase/Supplier';
import SalesOrderPage from './pages/sales/SalesOrder';
import SalesOutPage from './pages/sales/SalesOut';
import SalesReturnPage from './pages/sales/SalesReturn';
import SalesPriceStrategyPage from './pages/sales/SalesPriceStrategy';
import SalesOrderTrackPage from './pages/sales/SalesOrderTrack';
import PromotionPage from './pages/sales/Promotion';
import CustomerReconciliationPage from './pages/finance/CustomerReconciliation';
import SupplierReconciliationPage from './pages/finance/SupplierReconciliation';
import PurchaseOrderPage from './pages/purchase/PurchaseOrder';
import PurchaseOrderTrackPage from './pages/purchase/PurchaseOrderTrack';
import PurchaseInPage from './pages/purchase/PurchaseIn';
import PurchaseAlertPage from './pages/purchase/PurchaseAlert';
import PurchaseReturnPage from './pages/purchase/PurchaseReturn';
import PriceAgreementPage from './pages/purchase/PriceAgreement';
import InventoryAccountPage from './pages/inventory/InventoryAccount';
import InventoryInPage from './pages/inventory/InventoryIn';
import InventoryOutPage from './pages/inventory/InventoryOut';
import InventoryTransferPage from './pages/inventory/InventoryTransfer';
import InventoryCheckPage from './pages/inventory/InventoryCheck';
import InventoryRecordPage from './pages/inventory/InventoryRecord';
import BatchPage from './pages/inventory/Batch';
import BarcodePage from './pages/inventory/Barcode';
import InventoryAlertPage from './pages/inventory/InventoryAlert';
import QualityCheckPage from './pages/inventory/QualityCheck';
import FinanceInPage from './pages/finance/FinanceIn';
import FinanceOutPage from './pages/finance/FinanceOut';
import AccountPage from './pages/finance/Account';
import ReceivablePage from './pages/finance/Receivable';
import PayablePage from './pages/finance/Payable';
import TransactionPage from './pages/finance/Transaction';
import InvoicePage from './pages/finance/Invoice';
import ExpensePage from './pages/finance/Expense';
import SystemPage from './pages/system/System';
import ConfigPage from './pages/system/Config';
import NotificationPage from './pages/system/Notification';
import PrintTemplatePage from './pages/system/PrintTemplate';
import ReportPage from './pages/report/Report';
import { RequirePermission } from './components/RequirePermission';

// 路由权限映射
const routePermissionMap: Record<string, string> = {
  '/dashboard': 'report:dashboard',
  '/report': 'report:dashboard',
  '/warehouse': 'warehouse',
  '/warehouse/location': 'warehouse:warehouse:location',
  '/product': 'product:category',
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
      { path: 'warehouse', element: <PermissionRoute path="/warehouse" element={<WarehousePage />} /> },
      { path: 'warehouse/location', element: <PermissionRoute path="/warehouse" element={<WarehousePage defaultTab="location" />} /> },
      { path: 'customer', element: <PermissionRoute path="/customer" element={<CustomerPage />} /> },
      { path: 'supplier', element: <PermissionRoute path="/supplier" element={<SupplierPage />} /> },
      { path: 'sales/order', element: <PermissionRoute path="/sales/order" element={<SalesOrderPage />} /> },
      { path: 'sales/out', element: <PermissionRoute path="/sales/out" element={<SalesOutPage />} /> },
      { path: 'sales/return', element: <PermissionRoute path="/sales/return" element={<SalesReturnPage />} /> },
      { path: 'sales/strategy', element: <PermissionRoute path="/sales/strategy" element={<SalesPriceStrategyPage />} /> },
      { path: 'sales/price-strategy', element: <PermissionRoute path="/sales/price-strategy" element={<SalesPriceStrategyPage />} /> },
      { path: 'sales/track', element: <PermissionRoute path="/sales/track" element={<SalesOrderTrackPage />} /> },
      { path: 'sales/promotion', element: <PermissionRoute path="/sales/promotion" element={<PromotionPage />} /> },
      { path: 'purchase/order', element: <PermissionRoute path="/purchase/order" element={<PurchaseOrderPage />} /> },
      { path: 'purchase/track', element: <PermissionRoute path="/purchase/track" element={<PurchaseOrderTrackPage />} /> },
      { path: 'purchase/alert', element: <PermissionRoute path="/purchase/alert" element={<PurchaseAlertPage />} /> },
      { path: 'purchase/in', element: <PermissionRoute path="/purchase/in" element={<PurchaseInPage />} /> },
      { path: 'purchase/return', element: <PermissionRoute path="/purchase/return" element={<PurchaseReturnPage />} /> },
      { path: 'purchase/price-agreement', element: <PermissionRoute path="/purchase/price-agreement" element={<PriceAgreementPage />} /> },
      { path: 'inventory/account', element: <PermissionRoute path="/inventory/account" element={<InventoryAccountPage />} /> },
      { path: 'inventory/in', element: <PermissionRoute path="/inventory/in" element={<InventoryInPage />} /> },
      { path: 'inventory/out', element: <PermissionRoute path="/inventory/out" element={<InventoryOutPage />} /> },
      { path: 'inventory/transfer', element: <PermissionRoute path="/inventory/transfer" element={<InventoryTransferPage />} /> },
      { path: 'inventory/check', element: <PermissionRoute path="/inventory/check" element={<InventoryCheckPage />} /> },
      { path: 'inventory/record', element: <PermissionRoute path="/inventory/record" element={<InventoryRecordPage />} /> },
      { path: 'inventory/batch', element: <PermissionRoute path="/inventory/batch" element={<BatchPage />} /> },
      { path: 'inventory/barcode', element: <PermissionRoute path="/inventory/barcode" element={<BarcodePage />} /> },
      { path: 'inventory/alert', element: <PermissionRoute path="/inventory/alert" element={<InventoryAlertPage />} /> },
      { path: 'inventory/quality-check', element: <PermissionRoute path="/inventory/quality-check" element={<QualityCheckPage />} /> },
      { path: 'finance/in', element: <PermissionRoute path="/finance/in" element={<FinanceInPage />} /> },
      { path: 'finance/out', element: <PermissionRoute path="/finance/out" element={<FinanceOutPage />} /> },
      { path: 'finance/account', element: <PermissionRoute path="/finance/account" element={<AccountPage />} /> },
      { path: 'finance/receivable', element: <PermissionRoute path="/finance/receivable" element={<ReceivablePage />} /> },
      { path: 'finance/payable', element: <PermissionRoute path="/finance/payable" element={<PayablePage />} /> },
      { path: 'finance/transaction', element: <PermissionRoute path="/finance/transaction" element={<TransactionPage />} /> },
      { path: 'finance/invoice', element: <PermissionRoute path="/finance/invoice" element={<InvoicePage />} /> },
      { path: 'finance/expense', element: <PermissionRoute path="/finance/expense" element={<ExpensePage />} /> },
      { path: 'finance/customer-reconciliation', element: <PermissionRoute path="/finance/customer-reconciliation" element={<CustomerReconciliationPage />} /> },
      { path: 'finance/supplier-reconciliation', element: <PermissionRoute path="/finance/supplier-reconciliation" element={<SupplierReconciliationPage />} /> },
      { path: 'system', element: <PermissionRoute path="/system" element={<SystemPage defaultTab="user" />} /> },
      { path: 'system/user', element: <PermissionRoute path="/system" element={<SystemPage defaultTab="user" />} /> },
      { path: 'system/config', element: <PermissionRoute path="/system/config" element={<ConfigPage />} /> },
      { path: 'system/notification', element: <PermissionRoute path="/system/notification" element={<NotificationPage />} /> },
      { path: 'system/print-template', element: <PermissionRoute path="/system/print-template" element={<PrintTemplatePage />} /> },
      { path: 'role', element: <PermissionRoute path="/system" element={<SystemPage defaultTab="role" />} /> },
      { path: 'report', element: <PermissionRoute path="/report" element={<ReportPage />} /> },
      { path: 'report/dashboard', element: <PermissionRoute path="/report" element={<ReportPage />} /> },
    ],
  },
]);