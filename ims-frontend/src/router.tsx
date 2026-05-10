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
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'product', element: <ProductPage /> },
      { path: 'warehouse', element: <WarehousePage /> },
      { path: 'customer', element: <CustomerPage /> },
      { path: 'supplier', element: <SupplierPage /> },
      { path: 'sales/order', element: <SalesOrderPage /> },
      { path: 'sales/out', element: <SalesOutPage /> },
      { path: 'sales/return', element: <SalesReturnPage /> },
      { path: 'sales/strategy', element: <SalesPriceStrategyPage /> },
      { path: 'purchase/order', element: <PurchaseOrderPage /> },
      { path: 'purchase/in', element: <PurchaseInPage /> },
      { path: 'purchase/return', element: <PurchaseReturnPage /> },
      { path: 'inventory/account', element: <InventoryAccountPage /> },
      { path: 'inventory/in', element: <InventoryInPage /> },
      { path: 'inventory/out', element: <InventoryOutPage /> },
      { path: 'inventory/transfer', element: <InventoryTransferPage /> },
      { path: 'inventory/check', element: <InventoryCheckPage /> },
      { path: 'inventory/record', element: <InventoryRecordPage /> },
      { path: 'finance/in', element: <FinanceInPage /> },
      { path: 'finance/out', element: <FinanceOutPage /> },
      { path: 'finance/account', element: <AccountPage /> },
      { path: 'finance/receivable', element: <ReceivablePage /> },
      { path: 'finance/payable', element: <PayablePage /> },
      { path: 'finance/transaction', element: <TransactionPage /> },
      { path: 'system', element: <SystemPage /> },
      { path: 'report', element: <ReportPage /> },
    ],
  },
]);