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
import PromotionPage from './pages/sales/Promotion';
import CustomerReconciliationPage from './pages/finance/CustomerReconciliation';
import SupplierReconciliationPage from './pages/finance/SupplierReconciliation';
import PurchaseOrderPage from './pages/purchase/PurchaseOrder';
import PurchaseInPage from './pages/purchase/PurchaseIn';
import PurchaseReturnPage from './pages/purchase/PurchaseReturn';
import InventoryAccountPage from './pages/inventory/InventoryAccount';
import InventoryInPage from './pages/inventory/InventoryIn';
import InventoryOutPage from './pages/inventory/InventoryOut';
import InventoryTransferPage from './pages/inventory/InventoryTransfer';
import InventoryCheckPage from './pages/inventory/InventoryCheck';
import InventoryRecordPage from './pages/inventory/InventoryRecord';
import FinanceInPage from './pages/finance/FinanceIn';
import FinanceOutPage from './pages/finance/FinanceOut';
import AccountPage from './pages/finance/Account';
import ReceivablePage from './pages/finance/Receivable';
import PayablePage from './pages/finance/Payable';
import TransactionPage from './pages/finance/Transaction';
import SystemPage from './pages/system/System';
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
  '/sales/promotion': 'sales:promotion',
  '/purchase/order': 'purchase:order',
  '/purchase/in': 'purchase:in',
  '/purchase/return': 'purchase:return',
  '/inventory/account': 'inventory',
  '/inventory/in': 'inventory:in',
  '/inventory/out': 'inventory:out',
  '/inventory/transfer': 'inventory:transfer',
  '/inventory/check': 'inventory:check',
  '/inventory/record': 'inventory:record',
  '/finance/in': 'finance',
  '/finance/out': 'finance',
  '/finance/account': 'finance',
  '/finance/receivable': 'finance:receivable',
  '/finance/payable': 'finance:payable',
  '/finance/transaction': 'finance',
  '/finance/customer-reconciliation': 'finance:customerReconciliation',
  '/finance/supplier-reconciliation': 'finance:supplierReconciliation',
  '/system': 'system:menu',
  '/system/user': 'system:user',
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
      { path: 'sales/promotion', element: <PermissionRoute path="/sales/promotion" element={<PromotionPage />} /> },
      { path: 'purchase/order', element: <PermissionRoute path="/purchase/order" element={<PurchaseOrderPage />} /> },
      { path: 'purchase/in', element: <PermissionRoute path="/purchase/in" element={<PurchaseInPage />} /> },
      { path: 'purchase/return', element: <PermissionRoute path="/purchase/return" element={<PurchaseReturnPage />} /> },
      { path: 'inventory/account', element: <PermissionRoute path="/inventory/account" element={<InventoryAccountPage />} /> },
      { path: 'inventory/in', element: <PermissionRoute path="/inventory/in" element={<InventoryInPage />} /> },
      { path: 'inventory/out', element: <PermissionRoute path="/inventory/out" element={<InventoryOutPage />} /> },
      { path: 'inventory/transfer', element: <PermissionRoute path="/inventory/transfer" element={<InventoryTransferPage />} /> },
      { path: 'inventory/check', element: <PermissionRoute path="/inventory/check" element={<InventoryCheckPage />} /> },
      { path: 'inventory/record', element: <PermissionRoute path="/inventory/record" element={<InventoryRecordPage />} /> },
      { path: 'finance/in', element: <PermissionRoute path="/finance/in" element={<FinanceInPage />} /> },
      { path: 'finance/out', element: <PermissionRoute path="/finance/out" element={<FinanceOutPage />} /> },
      { path: 'finance/account', element: <PermissionRoute path="/finance/account" element={<AccountPage />} /> },
      { path: 'finance/receivable', element: <PermissionRoute path="/finance/receivable" element={<ReceivablePage />} /> },
      { path: 'finance/payable', element: <PermissionRoute path="/finance/payable" element={<PayablePage />} /> },
      { path: 'finance/transaction', element: <PermissionRoute path="/finance/transaction" element={<TransactionPage />} /> },
      { path: 'finance/customer-reconciliation', element: <PermissionRoute path="/finance/customer-reconciliation" element={<CustomerReconciliationPage />} /> },
      { path: 'finance/supplier-reconciliation', element: <PermissionRoute path="/finance/supplier-reconciliation" element={<SupplierReconciliationPage />} /> },
      { path: 'system', element: <PermissionRoute path="/system" element={<SystemPage defaultTab="user" />} /> },
      { path: 'system/user', element: <PermissionRoute path="/system" element={<SystemPage defaultTab="user" />} /> },
      { path: 'role', element: <PermissionRoute path="/system" element={<SystemPage defaultTab="role" />} /> },
      { path: 'report', element: <PermissionRoute path="/report" element={<ReportPage />} /> },
      { path: 'report/dashboard', element: <PermissionRoute path="/report" element={<ReportPage />} /> },
    ],
  },
]);